import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsString } from 'class-validator';

export class UsePromptDto {
  @IsString()
  @IsDefined()
  text: string;

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
  value: string;
}
