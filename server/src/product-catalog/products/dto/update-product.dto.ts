import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductSupplierDto } from './create-product.dto.js';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sku?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  productTypeId?: string;

  @IsOptional()
  @IsString()
  defaultUomId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  uom?: string;

  @IsOptional()
  @IsString()
  casNumber?: string;

  @IsOptional()
  @IsString()
  packing?: string;

  @IsOptional()
  @IsString()
  hsCode?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsBoolean()
  isBatchManaged?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  minStockLevel?: number;

  @IsOptional()
  @IsNumber()
  maxStockLevel?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductSupplierDto)
  supplierLinks?: CreateProductSupplierDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supplierIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manufacturerIds?: string[];
}
