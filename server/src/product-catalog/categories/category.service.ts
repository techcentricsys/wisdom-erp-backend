import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCategoryById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid category ID');
    }

    const category = await this.prisma.itemCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    let internalParentId: number | null = null;

    if (dto.parentId !== undefined && dto.parentId !== null) {
      const parent = await this.getCategoryById(dto.parentId);
      internalParentId = parent.id;
    }

    return this.prisma.itemCategory.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        parentId: internalParentId,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll() {
    return this.prisma.itemCategory.findMany({
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const category = await this.getCategoryById(id);

    return this.prisma.itemCategory.findUnique({
      where: { id: category.id },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const existing = await this.getCategoryById(id);

    const { parentId, ...otherFields } = dto;
    const data: any = { ...otherFields };

    if (parentId !== undefined) {
      if (parentId === null) {
        data.parentId = null;
      } else {
        if (parentId === id) {
          throw new BadRequestException(
            'A category cannot be its own parent',
          );
        }

        const parent = await this.getCategoryById(parentId);
        data.parentId = parent.id;
      }
    }

    return this.prisma.itemCategory.update({
      where: { id: existing.id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.getCategoryById(id);

    await this.prisma.itemCategory.delete({
      where: { id: existing.id },
    });

    return {
      message: 'Category deleted successfully',
      id: existing.id,
    };
  }
}
