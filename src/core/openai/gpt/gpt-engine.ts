import { Configuration, OpenAIApi } from 'openai';
import { OpenAiMessages } from './openai.messages';

export abstract class GptEngine {
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
    const response = await this.openai.createChatCompletion({
      model: this.model,
      messages: this.messages,
      max_tokens: this.contextMaxToken - Math.round(this.contentLength / 4),
      temperature: 0,
    });
    return response.data.choices[0].message.content;
  }
}
