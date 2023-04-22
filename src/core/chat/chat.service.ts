import { Injectable } from '@nestjs/common';
import { GptService } from '../openai/gpt.service';
import { ShortTermChatDto } from '../../prompt/dto/short-term-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly gpt: GptService) {}

  async shortTermChat(shortTermChat: ShortTermChatDto) {
    const result = await this.gpt.callShortTermMemory(shortTermChat);
    return { result };
  }
}
