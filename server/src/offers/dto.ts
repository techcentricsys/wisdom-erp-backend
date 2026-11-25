import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export const OFFER_STATUSES = ['Open', 'Indented', 'Denied'] as const;
export const OFFER_APPROVALS = ['Pending', 'Approved', 'Rejected'] as const;
export const SHIPMENT_ALLOWANCE = ['Allowed', 'Not Allowed'] as const;

export type OfferStatus = (typeof OFFER_STATUSES)[number];
export type OfferApproval = (typeof OFFER_APPROVALS)[number];

export class OfferItemDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(150)
  supplier?: string;

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

export class CreateOfferDto {
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
  inquiryNo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customer: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  customerId?: string;

  @IsOptional()
  @IsString()
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
  @MaxLength(1000)
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one product line.' })
  @ValidateNested({ each: true })
  @Type(() => OfferItemDto)
  lines: OfferItemDto[];
}

export class UpdateOfferDto {
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
  @IsNotEmpty()
  @MaxLength(40)
  inquiryNo?: string;

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
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsIn(OFFER_STATUSES)
  status?: OfferStatus;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least one product line.' })
  @ValidateNested({ each: true })
  @Type(() => OfferItemDto)
  lines?: OfferItemDto[];
}

export class DenyOfferDto {
  @IsString()
  @MinLength(3, { message: 'Enter the reason (at least 3 characters).' })
  @MaxLength(500)
  reason: string;
}

export class UpdateOfferApprovalDto {
  @IsIn(OFFER_APPROVALS)
  approval: OfferApproval;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}

export class QueryOfferDto {
  @IsOptional()
  @IsIn(OFFER_STATUSES)
  status?: OfferStatus;

  @IsOptional()
  @IsIn(OFFER_APPROVALS)
  approval?: OfferApproval;

  @IsOptional()
  @IsString()
  inquiryNo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
