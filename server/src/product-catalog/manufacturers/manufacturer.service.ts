
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto.js';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto.js';

@Injectable()
export class ManufacturerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateManufacturerDto) {
    return this.prisma.manufacturer.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.manufacturer.findMany({
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
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return manufacturer;
  }

  async update(id: number, dto: UpdateManufacturerDto) {
    await this.findOne(id);

    return this.prisma.manufacturer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.manufacturer.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
