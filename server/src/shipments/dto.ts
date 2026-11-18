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
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const LOAD_TYPES = ['FCL', 'LCL', 'AIR'] as const;
export const PAY_DOC_TYPES = ['LC', 'BC', 'CAD', 'TT'] as const;
export const SEND_RECIPIENTS = ['Customer', 'Supplier'] as const;

export class ShipmentItemDto {
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
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  qty?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001, { message: 'Shipped quantity must be greater than 0.' })
  shipQty: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  unit: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001, { message: 'Rate must be greater than 0.' })
  rate: number;
}

export class CreateShipmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  no?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lotNo?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  indentNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  indentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lcNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  lcDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  lcExpiry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  lcBank?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lcAccountNo?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  supplier: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer: string;

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
  @MaxLength(80)
  invoiceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  invoiceDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  blDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shipmentRemarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  otherRemarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  finalRemarks?: string;

  @IsOptional()
  @IsBoolean()
  readyForDebitNote?: boolean;

  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one shipment line.' })
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  lines: ShipmentItemDto[];
}

export class UpdateShipmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lotNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lcNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  lcDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  lcExpiry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  lcBank?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lcAccountNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  customer?: string;

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
  @MaxLength(80)
  invoiceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  invoiceDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  blDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shipmentRemarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  otherRemarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  finalRemarks?: string;

  @IsOptional()
  @IsBoolean()
  readyForDebitNote?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one shipment line.' })
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  lines?: ShipmentItemDto[];
}

export class ShipmentDocFileDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  fileName: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  sent?: boolean;
}

export class CreateShipmentDocDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  indentNo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  supplier: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  confNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  confDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  shipmentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  arrivalDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  payDocType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  payDocNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  payDocDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  paymentTerm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  bankAccountNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  latestShipDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  expShipDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  invoiceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  invoiceDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  blDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  vessel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sealNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  containerNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  grossWeight?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  cbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  blArrivalDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  blIssuePlace?: string;

  @IsOptional()
  @IsIn(LOAD_TYPES)
  loadType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  batchNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  mfgDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  expiryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  reEvalDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  trackNo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentDocFileDto)
  documents?: ShipmentDocFileDto[];
}

export class UpdateShipmentDocDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  customer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  confNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  confDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  shipmentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  arrivalDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  payDocType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  payDocNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  payDocDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  paymentTerm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  bankAccountNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  latestShipDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  expShipDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  invoiceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  invoiceDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  blDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  vessel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sealNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  containerNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  grossWeight?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  cbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  blArrivalDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  blIssuePlace?: string;

  @IsOptional()
  @IsIn(LOAD_TYPES)
  loadType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  batchNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  mfgDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  expiryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  reEvalDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  trackNo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentDocFileDto)
  documents?: ShipmentDocFileDto[];
}

export class SendShipmentDocDto {
  @IsIn(SEND_RECIPIENTS)
  sendTo: string;
}

export class QueryShipmentDto {
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
  salesperson?: string;

  @IsOptional()
  @IsString()
  commercialPerson?: string;

  @IsOptional()
  @IsIn(['All', 'Ready', 'Not ready'])
  debit?: string;

  @IsOptional()
  @IsString()
  indentNo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
