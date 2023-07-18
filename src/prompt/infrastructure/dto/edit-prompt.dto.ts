import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePromptDto } from './create-prompt.dto';

export class EditPromptDto extends CreatePromptDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}
