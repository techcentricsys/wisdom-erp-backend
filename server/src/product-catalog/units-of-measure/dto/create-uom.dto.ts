
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateUomDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
