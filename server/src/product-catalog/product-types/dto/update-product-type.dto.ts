import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateProductTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}