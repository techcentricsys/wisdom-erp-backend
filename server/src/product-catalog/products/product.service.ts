
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly productRelations = {
    category: true,
    productType: true,
    defaultUom: true,
    suppliers: {
      include: {
        supplier: true,
      },
    },
    manufacturers: {
      include: {
        manufacturer: true,
      },
    },
  };

  private validateId(id: number, field = 'Product') {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(`Invalid ${field} ID`);
    }
  }

  async create(dto: CreateProductDto) {
    const {
      supplierIds,
      supplierLinks,
      manufacturerIds,
      ...productData
    } = dto;

    const suppliers = supplierLinks?.length
      ? supplierLinks.map((link) => ({
          supplierId: Number(link.supplierId),
          supplierProductCode: link.supplierProductCode,
        }))
      : supplierIds?.map((supplierId) => ({
          supplierId: Number(supplierId),
          supplierProductCode: undefined,
        }));

    const manufacturers = manufacturerIds?.map((manufacturerId) => ({
      manufacturerId: Number(manufacturerId),
    }));

    suppliers?.forEach((supplier) => {
      this.validateId(supplier.supplierId, 'Supplier');
    });

    manufacturers?.forEach((manufacturer) => {
      this.validateId(manufacturer.manufacturerId, 'Manufacturer');
    });

    return this.prisma.item.create({
      data: {
        ...productData,

        suppliers: suppliers?.length
          ? {
              createMany: {
                data: suppliers,
              },
            }
          : undefined,

        manufacturers: manufacturers?.length
          ? {
              createMany: {
                data: manufacturers,
              },
            }
          : undefined,
      },
      include: this.productRelations,
    });
  }

  async findAll() {
    return this.prisma.item.findMany({
      include: this.productRelations,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    this.validateId(id);

    const product = await this.prisma.item.findUnique({
      where: { id },
      include: this.productRelations,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    this.validateId(id);
    await this.findOne(id);

    const {
      supplierIds,
      supplierLinks,
      manufacturerIds,
      ...productData
    } = dto;

    const suppliers = supplierLinks !== undefined
      ? supplierLinks.map((link) => ({
          supplierId: Number(link.supplierId),
          supplierProductCode: link.supplierProductCode,
        }))
      : supplierIds?.map((supplierId) => ({
          supplierId: Number(supplierId),
          supplierProductCode: undefined,
        }));

    const manufacturers = manufacturerIds?.map((manufacturerId) => ({
      manufacturerId: Number(manufacturerId),
    }));

    suppliers?.forEach((supplier) => {
      this.validateId(supplier.supplierId, 'Supplier');
    });

    manufacturers?.forEach((manufacturer) => {
      this.validateId(manufacturer.manufacturerId, 'Manufacturer');
    });

    return this.prisma.item.update({
      where: { id },
      data: {
        ...productData,

        suppliers: suppliers !== undefined
          ? {
              deleteMany: {},
              ...(suppliers.length
                ? {
                    createMany: {
                      data: suppliers,
                    },
                  }
                : {}),
            }
          : undefined,

        manufacturers: manufacturerIds !== undefined
          ? {
              deleteMany: {},
              ...(manufacturers?.length
                ? {
                    createMany: {
                      data: manufacturers,
                    },
                  }
                : {}),
            }
          : undefined,
      },
      include: this.productRelations,
    });
  }

  async remove(id: number) {
    this.validateId(id);
    await this.findOne(id);

    return this.prisma.item.delete({
      where: { id },
    });
  }
}
