import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export const ACCOUNT_TYPES = [
  'Supplier',
  'Customer',
  'Shipping Agent',
  'Manufacturer',
  'Bank',
  'Salesperson',
  'Commercial Person',
  'Account Category',
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_STATUSES = ['Active', 'Inactive'] as const;
export const BANK_TYPES = ['PRIMARY', 'INTERMEDIATE'] as const;

const SWIFT_RULE = /^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;
const SWIFT_MSG = 'SWIFT code must be 8 or 11 alphanumeric characters.';

export class BankDetailDto {
  @IsOptional()
  @IsIn(BANK_TYPES)
  bankType?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  bankName: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  branch?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  accountNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  accountTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  postCode?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @Matches(SWIFT_RULE, { message: SWIFT_MSG })
  swiftCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  iban?: string;
}

export class ContactPersonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  mobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  social?: string;
}

export class CreateMasterAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsIn(ACCOUNT_TYPES)
  type: AccountType;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  mobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  taxId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  postCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  originCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  factoryAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  factoryCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  factoryPostCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  factoryCountry?: string;

  @IsOptional()
  @IsIn(ACCOUNT_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => ContactPersonDto)
  contacts?: ContactPersonDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => BankDetailDto)
  bankDetails?: BankDetailDto[];
}

export class UpdateMasterAccountDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  mobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  taxId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  postCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  originCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  factoryAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  factoryCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  factoryPostCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  factoryCountry?: string;

  @IsOptional()
  @IsIn(ACCOUNT_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => ContactPersonDto)
  contacts?: ContactPersonDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => BankDetailDto)
  bankDetails?: BankDetailDto[];
}

export class AssignCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesperson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialPerson?: string;
}

export class QueryMasterAccountDto {
  @IsOptional()
  @IsIn(ACCOUNT_TYPES)
  type?: AccountType;

  @IsOptional()
  @IsIn(ACCOUNT_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
