import {IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString} from 'class-validator';
import { GPTModel } from '../../../core/openai/gpt/gtp-model.enum';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEnum(GPTModel)
  @IsNotEmpty()
  readonly model: GPTModel;

  @IsString()
  readonly description?: string;

  @IsBoolean()
  readonly opened: boolean;

  @IsArray()
  @IsString({ each: true })
  readonly categoryIds: string[];

  @IsArray()
  @IsString({ each: true })
  readonly categoryNamesToCreate?: string[];
}
