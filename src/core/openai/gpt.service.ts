import { Injectable } from '@nestjs/common';

import { Configuration, OpenAIApi } from 'openai';
import { OpenAiMessages, SystemMessage } from './gpt/openai.messages';
import { ShortTermChatDto } from '../../prompt/dto/short-term-chat.dto';

@Injectable()
export class GptService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async callWithPrompt(prompt: string) {
    const messages = [new SystemMessage(prompt)];
    return this.createChatCompletion(messages);
  }

  async callShortTermMemory(shortTermChat: ShortTermChatDto) {
    return this.createChatCompletion(shortTermChat.messages);
  }

  private async createChatCompletion(
    messages: OpenAiMessages,
  ): Promise<string> {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
      temperature: 0,
    });
    return response.data.choices[0].message.content;
  }
}
