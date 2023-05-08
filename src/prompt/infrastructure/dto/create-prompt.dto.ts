import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsArray()
  @IsString({ each: true })
  readonly categoryIds: string[];

  @IsArray()
  @IsString({ each: true })
  readonly categoryNamesToCreate?: string[];
}
