import { Injectable } from '@nestjs/common';
import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { GptService } from '../../core/openai/gpt.service';
import { UsePromptDto } from '../dto/use-prompt.dto';
import { PromptRepository } from '../../prompt/infrastructure/accessors/prompt.repository';
import { ChatInitializer } from '../domain/chat-initializer';

@Injectable()
export class ChatService {
  constructor(
    private readonly gpt: GptService,
    private readonly promptRepository: PromptRepository,
  ) {}

  async continueChatting(shortTermChat: ShortTermChatDto) {
    const result = await this.gpt.callShortTermMemory(shortTermChat);
    return { result };
  }

  async usePrompt(promptId: string, usePrompDto: UsePromptDto) {
    const promptTemplate = await this.promptRepository.findPromptById(promptId);

    const initializer = new ChatInitializer(promptTemplate.text);
    const prompt = initializer.renderPrompt(usePrompDto.variables);
    const result = await this.gpt.callWithPrompt(prompt);
    return { result };
  }
}
