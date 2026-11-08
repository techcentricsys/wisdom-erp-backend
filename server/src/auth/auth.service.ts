
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  // LOGIN API
  async login(user: any) {
    if (
      !user?.email ||
      typeof user.email !== 'string' ||
      !user?.password ||
      typeof user.password !== 'string'
    ) {
      throw new BadRequestException(
        'Email and password are required.',
      );
    }

    const email = user.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (
      !existing ||
      !existing.passwordHash ||
      !(await bcrypt.compare(
        user.password,
        existing.passwordHash,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const roles = existing.userRoles.map(
      ({ role }) => role.name,
    );

    const accessToken = this.jwt.sign({
      sub: existing.id,
      email: existing.email,
      roles,
    });

    return {
      access_token: accessToken,
      user: {
        id: existing.id,
        email: existing.email,
        firstName: existing.firstName,
        lastName: existing.lastName,
        status: existing.status,
        companyId: existing.companyId,
        roles: existing.userRoles.map(({ role }) => ({
          id: role.id,
          name: role.name,
        })),
      },
    };
  }

  // SIGNUP API
  async signup(data: any) {
    if (
      !data?.company?.name ||
      !data?.company?.code ||
      !data?.admin?.email ||
      !data?.admin?.password ||
      !data?.admin?.full_name
    ) {
      throw new BadRequestException(
        'Required signup fields are missing.',
      );
    }

    if (
      typeof data.admin.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.admin.email.trim())
    ) {
      throw new BadRequestException('Invalid email address.');
    }

    if (
      typeof data.admin.password !== 'string' ||
      data.admin.password.length < 8
    ) {
      throw new BadRequestException(
        'Password must be at least 8 characters long.',
      );
    }

    const email = data.admin.email.trim().toLowerCase();
    const companyName = data.company.name.trim();
    const companyCode = data.company.code.trim().toUpperCase();
    const fullName = data.admin.full_name.trim();

    if (!companyName || !companyCode || !fullName) {
      throw new BadRequestException(
        'Company name, company code, and full name cannot be empty.',
      );
    }

    try {
      const passwordHash = await bcrypt.hash(
        data.admin.password,
        12,
      );

      // Create company, role, and user in one transaction
      const result = await this.prisma.$transaction(
        async (tx) => {
          // 1. Create company
          const company = await tx.company.create({
            data: {
              name: companyName,
              code: companyCode,
              email: data.company.email?.trim().toLowerCase(),
              phone: data.company.phone?.trim(),
              address: data.company.address?.trim(),
            },
          });

          // 2. Find or create ADMIN role
          const adminRole = await tx.role.upsert({
            where: {
              name: 'ADMIN',
            },
            update: {},
            create: {
              name: 'ADMIN',
              description: 'Company Administrator',
            },
          });

          // 3. Split full name
          const nameParts = fullName.split(/\s+/);

          // 4. Create user and link company and role
          const user = await tx.user.create({
            data: {
              email,
              passwordHash,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' '),

              company: {
                connect: {
                  id: company.id,
                },
              },

              userRoles: {
                create: {
                  role: {
                    connect: {
                      id: adminRole.id,
                    },
                  },
                },
              },
            },
            include: {
              userRoles: {
                include: {
                  role: true,
                },
              },
            },
          });

          return {
            user,
            company,
          };
        },
      );

      // 5. Get assigned roles
      const roles = result.user.userRoles.map(
        ({ role }) => role.name,
      );

      // 6. Generate JWT
      const accessToken = this.jwt.sign({
        sub: result.user.id,
        email: result.user.email,
        roles,
      });

      // 7. Return safe response
      return {
        access_token: accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          status: result.user.status,
          companyId: result.company.id,
          roles: result.user.userRoles.map(({ role }) => ({
            id: role.id,
            name: role.name,
          })),
        },
      };
    } catch (error) {
      // Handle duplicate email or company code
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Email or company code already exists.',
        );
      }

      throw error;
    }
  }
}
