
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { ProductTypeService } from './product-type.service.js';
import { CreateProductTypeDto } from './dto/create-product-type.dto.js';
import { UpdateProductTypeDto } from './dto/update-product-type.dto.js';

@Controller('product-types')
export class ProductTypeController {
  constructor(
    private readonly productTypeService: ProductTypeService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductTypeDto) {
    return this.productTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.productTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductTypeDto,
  ) {
    return this.productTypeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productTypeService.remove(id);
  }
}
