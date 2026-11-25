import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export const SETUP_KINDS = [
  'department',
  'designation',
  'salesperson',
  'commercialPerson',
  'manufacturer',
  'shippingAgent',
  'bank',
  'accountCategory',
  'origin',
  'port',
  'incoterm',
  'shippingMode',
  'paymentTerm',
  'currency',
  'checklist',
] as const;

export type SetupKind = (typeof SETUP_KINDS)[number];

export const SETUP_STATUSES = ['Active', 'Inactive'] as const;
export const PORT_USES = ['Both', 'Loading', 'Destination'] as const;
export const MAIL_SECURITIES = ['None', 'SSL', 'TLS'] as const;

const SWIFT_RULE = /^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;
const CURRENCY_RULE = /^[A-Za-z]{3}$/;
const HOST_RULE = /^([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
const PORT_RULE = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

export class CreateSetupMasterDto {
  @IsIn(SETUP_KINDS)
  kind: SetupKind;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(SETUP_STATUSES)
  status?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @Matches(SWIFT_RULE, {
    message: 'Swift code must be 8 or 11 letters/digits.',
  })
  swift?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsIn(PORT_USES)
  use?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @Matches(CURRENCY_RULE, { message: 'Use a 3 letter currency code, e.g. USD.' })
  code?: string;
}

export class UpdateSetupMasterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(SETUP_STATUSES)
  status?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @Matches(SWIFT_RULE, {
    message: 'Swift code must be 8 or 11 letters/digits.',
  })
  swift?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsIn(PORT_USES)
  use?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @Matches(CURRENCY_RULE, { message: 'Use a 3 letter currency code, e.g. USD.' })
  code?: string;
}

export class SaveMailSetupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  senderName: string;

  @IsEmail()
  @MaxLength(150)
  senderEmail: string;

  @Matches(HOST_RULE, { message: 'Enter a valid host, e.g. smtp.company.com.' })
  @MaxLength(150)
  host: string;

  @Matches(PORT_RULE, { message: 'Port must be a whole number from 1 to 65535.' })
  port: string;

  @IsOptional()
  @IsIn(MAIL_SECURITIES)
  security?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  signature?: string;
}

export class QuerySetupMasterDto {
  @IsOptional()
  @IsIn(SETUP_KINDS)
  kind?: SetupKind;

  @IsOptional()
  @IsIn(SETUP_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
