import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
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
  @IsOptional() @IsString() productId?: string;
  @IsString() @IsNotEmpty() @MaxLength(150) product: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(2000) detail?: string;
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  shipQty: number;
  @IsString() @IsNotEmpty() unit: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 4 }) @Min(0) scRate: number;
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
  otherAmt = 0;
}
export class CreateDebitNoteDto {
  @IsString() @IsNotEmpty() shipmentNo: string;
  @IsDateString() debitNoteDate: string;
  @IsString() @IsNotEmpty() supplierId: string;
  @IsString() @IsNotEmpty() customerId: string;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DebitNoteLineDto)
  lines: DebitNoteLineDto[];
}
export class UpdateDebitNoteDto extends CreateDebitNoteDto {}
export class ReceiptAllocationDto {
  @IsString() @IsNotEmpty() debitNoteId: string;
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  paidAmount: number;
}
export class CreateCommissionReceiptDto {
  @IsDateString() receiptDate: string;
  @IsString() @IsNotEmpty() supplierId: string;
  @IsOptional() @IsString() @MaxLength(120) refNo?: string;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceiptAllocationDto)
  lines: ReceiptAllocationDto[];
}
export class UpdateCommissionReceiptDto extends CreateCommissionReceiptDto {}
export class QuerySettlementDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() status?: string;
}
