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

  async continueChatting(shortTermChat: ShortTermChatDto, promptId: string) {
    const promptTemplate = await this.promptRepository.findPromptById(promptId);
    const result = await this.gpt.callShortTermMemory(
      shortTermChat,
      promptTemplate.model,
    );
    return { result };
  }

  async usePrompt(promptId: string, usePrompDto: UsePromptDto) {
    const promptTemplate = await this.promptRepository.findPromptById(promptId);

    const initializer = new ChatInitializer(
      promptTemplate.text,
      usePrompDto.variables,
      promptTemplate.model,
    );
    const prompt = initializer.renderPrompt();
    const result = await this.gpt.callWithPrompts(prompt, promptTemplate.model);
    return { result };
  }
}
