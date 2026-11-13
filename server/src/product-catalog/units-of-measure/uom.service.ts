
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { CreateUomDto } from './dto/create-uom.dto.js';
import { UpdateUomDto } from './dto/update-uom.dto.js';

@Injectable()
export class UomService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid Unit of Measure ID');
    }
  }

  // Create a unit of measure
  async create(dto: CreateUomDto) {
    return this.prisma.unitOfMeasure.create({
      data: {
        code: dto.code,
        description: dto.description,
      },
    });
  }

  // Get all units
  async findAll() {
    return this.prisma.unitOfMeasure.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  // Get one unit by ID
  async findOne(id: number) {
    this.validateId(id);

    const uom = await this.prisma.unitOfMeasure.findUnique({
      where: { id },
    });

    if (!uom) {
      throw new NotFoundException('Unit of measure not found');
    }

    return uom;
  }

  // Update a unit
  async update(id: number, dto: UpdateUomDto) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.unitOfMeasure.update({
      where: { id },
      data: dto,
    });
  }

  // Delete a unit
  async remove(id: number) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.unitOfMeasure.delete({
      where: { id },
    });
  }
}
