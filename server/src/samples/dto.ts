import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const EXPIRY_FILTERS = [
  'All',
  'Valid',
  'Expiring Soon',
  'Expired',
] as const;

export class SampleReceiveItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  product: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001, { message: 'Quantity must be greater than 0.' })
  qty: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  unit: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  packSize?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  batchNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  mfgDate?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  expDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  origin?: string;
}

export class CreateSampleReceiveDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  no?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  supplier: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one sample line.' })
  @ValidateNested({ each: true })
  @Type(() => SampleReceiveItemDto)
  lines: SampleReceiveItemDto[];
}

export class UpdateSampleReceiveDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one sample line.' })
  @ValidateNested({ each: true })
  @Type(() => SampleReceiveItemDto)
  lines?: SampleReceiveItemDto[];
}

export class SampleIssueItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  product: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  batchNo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  unit: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001, { message: 'Quantity must be greater than 0.' })
  qty: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

export class CreateSampleIssueDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  no?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one sample line.' })
  @ValidateNested({ each: true })
  @Type(() => SampleIssueItemDto)
  lines: SampleIssueItemDto[];
}

export class UpdateSampleIssueDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one sample line.' })
  @ValidateNested({ each: true })
  @Type(() => SampleIssueItemDto)
  lines?: SampleIssueItemDto[];
}

export class QuerySampleDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsIn(EXPIRY_FILTERS)
  expiry?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
