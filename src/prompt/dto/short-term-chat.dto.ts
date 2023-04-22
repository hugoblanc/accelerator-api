import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export class ShortTermChatDto {
  @IsArray()
  @Type(() => Message)
  messages: Message[];
}

class Message {
  @IsString()
  content: string;

  @IsEnum(ChatCompletionRequestMessageRoleEnum)
  role: ChatCompletionRequestMessageRoleEnum;
}
