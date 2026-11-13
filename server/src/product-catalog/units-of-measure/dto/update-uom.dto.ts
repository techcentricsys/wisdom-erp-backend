
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateUomDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
