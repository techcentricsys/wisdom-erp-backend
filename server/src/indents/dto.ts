import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const INDENT_STATUSES = ['Active', 'Cancelled'] as const;
export const PO_STATUSES = ['PO Pending', 'PO Issued'] as const;
export const SHIPMENT_STATUSES = ['Not Shipped', 'Partial', 'Shipped'] as const;
export const SHIPMENT_ALLOWANCE = ['Allowed', 'Not Allowed'] as const;
export const BANK_TYPES = ['Bank', 'Intermediate Bank'] as const;

export type IndentStatus = (typeof INDENT_STATUSES)[number];
export type PoStatus = (typeof PO_STATUSES)[number];
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export class IndentItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  productId?: string;

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
  @Min(0.0001, { message: 'Quantity must be greater than 0.' })
  qty: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  unit: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001, { message: 'Rate must be greater than 0.' })
  rate: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(100)
  comm?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  shippingMode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  paymentTerm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  manufacturer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  packing?: string;
}

export class CreateIndentDto {
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
  @MaxLength(30)
  validity: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  offerNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  offerDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refNo?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  customerId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  supplier: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  supplierId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  salespersonId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;

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
  @MaxLength(50)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  incoterm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  insurance?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  shippingAgent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  shippingMark?: string;

  @IsOptional()
  @IsIn(SHIPMENT_ALLOWANCE)
  partialShipment?: string;

  @IsOptional()
  @IsIn(SHIPMENT_ALLOWANCE)
  transShipment?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  shipmentPeriod?: string;

  @IsOptional()
  @IsIn(BANK_TYPES)
  bankType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specialNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  instruction?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  printWithLogo?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  checklist?: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one product line.' })
  @ValidateNested({ each: true })
  @Type(() => IndentItemDto)
  lines: IndentItemDto[];
}

export class UpdateIndentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  validity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refNo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  customerId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  supplierId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  salespersonId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;

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
  @MaxLength(50)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  incoterm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  insurance?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  shippingAgent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  shippingMark?: string;

  @IsOptional()
  @IsIn(SHIPMENT_ALLOWANCE)
  partialShipment?: string;

  @IsOptional()
  @IsIn(SHIPMENT_ALLOWANCE)
  transShipment?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  shipmentPeriod?: string;

  @IsOptional()
  @IsIn(BANK_TYPES)
  bankType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specialNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  instruction?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  printWithLogo?: boolean;

  @IsOptional()
  @IsIn(PO_STATUSES)
  poStatus?: PoStatus;

  @IsOptional()
  @IsIn(SHIPMENT_STATUSES)
  shipStatus?: ShipmentStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  checklist?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one product line.' })
  @ValidateNested({ each: true })
  @Type(() => IndentItemDto)
  lines?: IndentItemDto[];
}

export class QueryIndentDto {
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
  shippingAgent?: string;

  @IsOptional()
  @IsString()
  salesperson?: string;

  @IsOptional()
  @IsString()
  commercialPerson?: string;

  @IsOptional()
  @IsIn(PO_STATUSES)
  poStatus?: PoStatus;

  @IsOptional()
  @IsIn(SHIPMENT_STATUSES)
  shipStatus?: ShipmentStatus;

  @IsOptional()
  @IsIn(INDENT_STATUSES)
  status?: IndentStatus;

  @IsOptional()
  @IsString()
  offerNo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
