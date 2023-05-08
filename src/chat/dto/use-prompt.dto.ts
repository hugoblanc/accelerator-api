import { VariableType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsEnum, IsString } from 'class-validator';

export class UsePromptDto {
  @IsArray()
  @Type(() => Variable)
  variables: Variable[];
}

class Variable {
  @IsString()
  @IsDefined()
  name: string;

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
