import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateUomDto } from './dto/create-uom.dto.js';
import { UpdateUomDto } from './dto/update-uom.dto.js';

@Injectable()
export class UomService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: string) {
    if (!id?.trim()) {
      throw new BadRequestException('Invalid Unit of Measure ID');
    }
  }

  async create(dto: CreateUomDto) {
    return this.prisma.unitOfMeasure.create({
      data: {
        code: dto.code,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.unitOfMeasure.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  async findOne(id: string) {
    this.validateId(id);

    const uom = await this.prisma.unitOfMeasure.findUnique({
      where: { id },
    });

    if (!uom) {
      throw new NotFoundException('Unit of measure not found');
    }

    return uom;
  }

  async update(id: string, dto: UpdateUomDto) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.unitOfMeasure.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.unitOfMeasure.delete({
      where: { id },
    });
  }
}
