import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class InquiryItemDto {
  @IsString()
  productId!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  quantity!: number;

  @IsString()
  unit!: string;

  @IsOptional()
  @IsString()
  shippingMode?: string;

  @IsOptional()
  @IsString()
  paymentTerm?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shipmentSchedule?: string;

  @IsOptional()
  @IsString()
  packing?: string;

  @IsOptional()
  @IsString()
  detail?: string;
}

export class CreateInquiryDto {
  @IsOptional()
  @IsDateString()
  inquiryDate?: string;

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  salespersonId?: string;

  @IsOptional()
  @IsString()
  salespersonMasterId?: string;

  @IsOptional()
  @IsString()
  commercialPersonId?: string;

  @IsOptional()
  @IsString()
  commercialPersonMasterId?: string;

  @IsOptional()
  @IsString()
  incoterm?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  portLoading?: string;

  @IsOptional()
  @IsString()
  portDestination?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InquiryItemDto)
  items!: InquiryItemDto[];
}

export class UpdateInquiryDto {
  @IsOptional()
  @IsDateString()
  inquiryDate?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  salespersonId?: string | null;

  @IsOptional()
  @IsString()
  salespersonMasterId?: string | null;

  @IsOptional()
  @IsString()
  commercialPersonId?: string | null;

  @IsOptional()
  @IsString()
  commercialPersonMasterId?: string | null;

  @IsOptional()
  @IsString()
  incoterm?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  portLoading?: string;

  @IsOptional()
  @IsString()
  portDestination?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InquiryItemDto)
  items?: InquiryItemDto[];
}

export class CancelInquiryDto {
  @IsString()
  cancelReason!: string;
}

export class SupplierRateSheetDto {
  @IsString()
  inquiryItemId!: string;

  @IsString()
  supplierId!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quotedRate!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  commissionPct?: number;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}

export class UpdateSupplierRateSheetDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quotedRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  commissionPct?: number;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}
