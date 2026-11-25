import {
  IsBoolean, IsEmail, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength,
} from 'class-validator';
import { CUSTOM_BASE_ROLES } from './access-model.js';

const BASES = ['Super Admin', 'Local Admin', 'Local User'];
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const PASSWORD_MSG = 'Password needs a letter and a number.';

export class AccessLoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() @MaxLength(128) password: string;
}

export class AccessRegisterDto {
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) @MaxLength(72) @Matches(PASSWORD_RULE, { message: PASSWORD_MSG }) password: string;
}

export class ChangePasswordDto {
  @IsString() @IsNotEmpty() @MaxLength(128) current: string;
  @IsString() @MinLength(8) @MaxLength(72) @Matches(PASSWORD_RULE, { message: PASSWORD_MSG }) next: string;
}

export class CreateUserDto {
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) @MaxLength(72) @Matches(PASSWORD_RULE, { message: PASSWORD_MSG }) password: string;
  @IsOptional() @IsIn(BASES) role?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsString() @MaxLength(100) department?: string;
  @IsOptional() @IsString() @MaxLength(100) designation?: string;
  @IsOptional() @IsString() managerId?: string;
  @IsOptional() @IsBoolean() canCreateMaster?: boolean;
}

export class UpdateUserDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) name?: string;
  @IsOptional() @IsIn(BASES) role?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsString() @MaxLength(100) department?: string;
  @IsOptional() @IsString() @MaxLength(100) designation?: string;
  @IsOptional() @IsString() managerId?: string;
  @IsOptional() @IsIn(['Active', 'Inactive']) status?: string;
  @IsOptional() @IsBoolean() canCreateMaster?: boolean;
}

export class CreateRoleDto {
  @IsString() @MaxLength(100) name: string;
  @IsIn(CUSTOM_BASE_ROLES) baseRole: string;
  @IsOptional() @IsString() copyFromId?: string;
}

export class SavePermissionsDto {
  @IsObject() permissions: Record<string, Record<string, boolean>>;
}
