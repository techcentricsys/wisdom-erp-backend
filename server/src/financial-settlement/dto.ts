import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class DebitNoteLineDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  product: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  detail?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  shipQty: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  scRate: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  indRate: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(100)
  commPct: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  otherAmt?: number;
}

export class CreateDebitNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  no?: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  shipmentNo: string;

  @IsOptional()
  @IsString()
  shipDate?: string;

  @IsOptional()
  @IsString()
  invNo?: string;

  @IsOptional()
  @IsString()
  invDate?: string;

  @IsOptional()
  @IsString()
  lcNo?: string;

  @IsOptional()
  @IsString()
  lcDate?: string;

  @IsString()
  @IsNotEmpty()
  supplier: string;

  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DebitNoteLineDto)
  lines: DebitNoteLineDto[];
}

export class UpdateDebitNoteDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  shipmentNo?: string;

  @IsOptional()
  @IsString()
  shipDate?: string;

  @IsOptional()
  @IsString()
  invNo?: string;

  @IsOptional()
  @IsString()
  invDate?: string;

  @IsOptional()
  @IsString()
  lcNo?: string;

  @IsOptional()
  @IsString()
  lcDate?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DebitNoteLineDto)
  lines?: DebitNoteLineDto[];
}

export class ReceiptAllocationDto {
  @IsString()
  @IsNotEmpty()
  debitNoteNo: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
}

export class CreateCommissionReceiptDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  no?: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  supplier: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  refNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceiptAllocationDto)
  lines: ReceiptAllocationDto[];
}

export class UpdateCommissionReceiptDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  refNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceiptAllocationDto)
  lines?: ReceiptAllocationDto[];
}

export class QuerySettlementDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
