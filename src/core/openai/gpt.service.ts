import { Injectable } from '@nestjs/common';

import { GPTModel } from '@prisma/client';
import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { Gpt35Engine } from './gpt/gpt-3.5-engine';
import { GptEngine } from './gpt/gpt-engine';
import { Gpt4Engine } from './gpt/gtp-4-engine';
import {
  OpenAiMessages,
  SystemMessage,
  UserMessage,
} from './gpt/openai.messages';

@Injectable()
export class GptService {
  async callWithPrompts(prompts: string[], model: GPTModel) {
    const messages = prompts.map((prompt) => new UserMessage(prompt));

    prompts.forEach((prompt, i) => {
      console.log('prompt N°' + (i + 1) + ' size ' + prompt.length, prompt);
    });

    const conversations = messages.map((message) => [
      new SystemMessage('You are a helpful assistant'),
      message,
    ]);

    const Engine = this.createEngineFromModel(model);
    const completionsPromises = conversations.map((conversation) => {
      const engine = new Engine(conversation);
      return engine.createChatCompletion();
    });

    return (await Promise.all(completionsPromises)).join('\n');
  }

  async callShortTermMemory(shortTermChat: ShortTermChatDto, model: GPTModel) {
    const Engine = this.createEngineFromModel(model);
    const engine = new Engine(shortTermChat.messages);
    return engine.createChatCompletion();
  }

  private createEngineFromModel(
    model: GPTModel,
  ): new (messages: OpenAiMessages) => GptEngine {
    if (model === GPTModel.GPT4) {
      return Gpt4Engine;
    } else {
      return Gpt35Engine;
    }
  }
}
