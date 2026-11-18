import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const PURCHASE_ORDER_STATUSES = ['Issued', 'Cancelled'] as const;

export class PurchaseOrderLineDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  indentItemId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  itemId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  product: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  qty: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  indentQty: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  unit?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  rate: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  packing?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  manufacturer?: string;
}

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  indentNo: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  incoterm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  portLoading?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  portDestination?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineDto)
  lines: PurchaseOrderLineDto[];
}

export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  incoterm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  portLoading?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  portDestination?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineDto)
  lines?: PurchaseOrderLineDto[];
}

export class QueryPurchaseOrderDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['All', ...PURCHASE_ORDER_STATUSES])
  status?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  indentNo?: string;
}
