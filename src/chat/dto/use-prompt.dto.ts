import { VariableType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UsePromptDto {
  @IsArray()
  @Type(() => Variable)
  variables: Variable[];
}

class Variable {
  @IsString()
  @IsDefined()
  key: string;

  @IsString()
  @IsDefined()
  value: string;

  @IsDefined()
  @IsEnum(VariableType)
  type: VariableType;
}

export class UsePromptDtoV2 {
  @Transform(({ value }) =>
    JSON.parse(value).map((v: any) => Object.assign(new Variable(), v)),
  )
  @IsArray()
  @Type(() => Variable)
  @ValidateNested()
  variables: Variable[];
}
