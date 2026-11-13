
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { CreateProductTypeDto } from './dto/create-product-type.dto.js';
import { UpdateProductTypeDto } from './dto/update-product-type.dto.js';

@Injectable()
export class ProductTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductTypeDto) {
    return this.prisma.productType.create({
      data: {
        name: dto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.productType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const productType = await this.prisma.productType.findUnique({
      where: { id },
    });

    if (!productType) {
      throw new NotFoundException('Product type not found');
    }

    return productType;
  }

  async update(id: number, dto: UpdateProductTypeDto) {
    await this.findOne(id);

    return this.prisma.productType.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.productType.delete({
      where: { id },
    });
  }
}
