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
  async callWithPrompts(prompts: string[]) {
    const messages = prompts.map((prompt) => new UserMessage(prompt));

    prompts.forEach((prompt, i) => {
      console.log('prompt N°' + (i + 1) + ' size ' + prompt.length, prompt);
    });

    const conversations = messages.map((message) => [
      new SystemMessage('You are a helpful assistant'),
      message,
    ]);

    const completionsPromises = conversations.map((conversation) =>
      this.createGPT3ChatCompletion(conversation),
    );

    return (await Promise.all(completionsPromises)).join('\n');
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
