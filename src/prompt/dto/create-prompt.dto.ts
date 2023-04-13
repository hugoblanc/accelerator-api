import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
