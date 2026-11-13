
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid Supplier ID');
    }
  }

  async create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany({
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    this.validateId(id);

    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(id: number, dto: UpdateSupplierDto) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.supplier.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
