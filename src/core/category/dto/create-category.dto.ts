import { Transform } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsDefined()
  @Transform(({ value }) => value.trim())
  name: string;
}
