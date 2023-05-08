import { Injectable } from '@nestjs/common';

import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { Gpt35Engine } from './gpt/gpt-3.5-engine';
import {
  OpenAiMessages,
  SystemMessage,
  UserMessage,
} from './gpt/openai.messages';

@Injectable()
export class GptService {
  async callWithPrompt(prompt: string) {
    const messages = [
      new SystemMessage('You are a helpful assistant'),
      new UserMessage(prompt),
    ];
    return this.createGPT3ChatCompletion(messages);
  }

  async callShortTermMemory(shortTermChat: ShortTermChatDto) {
    return this.createGPT3ChatCompletion(shortTermChat.messages);
  }

  private async createGPT3ChatCompletion(
    messages: OpenAiMessages,
  ): Promise<string> {
    const engine = new Gpt35Engine(messages);
    return engine.createChatCompletion();
  }
}
