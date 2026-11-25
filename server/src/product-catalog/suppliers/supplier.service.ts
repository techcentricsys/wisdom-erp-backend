import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: string) {
    if (!id?.trim()) {
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

  async findOne(id: string) {
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

  async update(id: string, dto: UpdateSupplierDto) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
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
