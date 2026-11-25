import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CategoryController } from './categories/category.controller.js';
import { CategoryService } from './categories/category.service.js';
import { ManufacturerController } from './manufacturers/manufacturer.controller.js';
import { ManufacturerService } from './manufacturers/manufacturer.service.js';
import { ProductTypeController } from './product-types/product-type.controller.js';
import { ProductTypeService } from './product-types/product-type.service.js';
import { ProductController } from './products/product.controller.js';
import { ProductService } from './products/product.service.js';
import { SupplierController } from './suppliers/supplier.controller.js';
import { SupplierService } from './suppliers/supplier.service.js';
import { UomController } from './units-of-measure/uom.controller.js';
import { UomService } from './units-of-measure/uom.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CategoryController,
    ProductTypeController,
    UomController,
    ProductController,
    SupplierController,
    ManufacturerController,
  ],
  providers: [
    CategoryService,
    ProductTypeService,
    UomService,
    ProductService,
    SupplierService,
    ManufacturerService,
  ],
})
export class ProductCatalogModule {}
