import { Injectable } from '@nestjs/common';

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

@Injectable()
export class GptService {
  async callOpenAI(prompt: string) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: prompt,
      },
    ];

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 400,
      temperature: 0,
    });
    console.log('call successful');
    return response.data.choices[0].message.content;
  }
}
