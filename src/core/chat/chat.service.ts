import { Injectable } from '@nestjs/common';
import { GptService } from '../openai/gpt.service';
import { ShortTermChatDto } from '../../prompt/dto/short-term-chat.dto';
import { UsePromptDto } from './dto/use-prompt.dto';

@Injectable()
export class ChatService {
  constructor(private readonly gpt: GptService) {}

  async continueChatting(shortTermChat: ShortTermChatDto) {
    const result = await this.gpt.callShortTermMemory(shortTermChat);
    return { result };
  }

  async usePrompt(usePrompDto: UsePromptDto) {
    let text = usePrompDto.text;
    console.log(text);

    const variables = usePrompDto.variables;
    variables.forEach((variable) => {
      console.log('look for ' + `[${variable.name}]`);

      text = text.replace(`[${variable.name}]`, variable.value);
    });

    console.log(text);

    const result = await this.gpt.callWithPrompt(text);
    return { result };
  }
}
