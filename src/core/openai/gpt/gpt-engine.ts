import { Configuration, OpenAIApi } from 'openai';
import { OpenAiMessages } from './openai.messages';
import { Logger } from '@nestjs/common';

export abstract class GptEngine {
  logger = new Logger(GptEngine.name);
  protected contentLength: number;
  protected openai: OpenAIApi;

  abstract model: string;
  abstract contextMaxToken: number;

  constructor(protected messages: OpenAiMessages) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);

    this.contentLength = messages.reduce((acc, message) => {
      acc += message.content.length;
      return acc;
    }, 0);
  }

  async createChatCompletion(): Promise<string> {
    console.log('this.contextMaxToken - Math.round(this.contentLength / 1.8)');
    const max_tokens =
      this.contextMaxToken - Math.round(this.contentLength / 3);
    console.log(max_tokens);

    try {
      const response = await this.openai.createChatCompletion({
        model: this.model,
        messages: this.messages,
        max_tokens,
        temperature: 0,
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error(error);
      this.logger.error(error.message);
      throw error;
    }
  }
}
