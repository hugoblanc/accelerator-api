import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PromptService } from 'src/prompt/prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UsePromptDto } from '../core/chat/dto/use-prompt.dto';
import { ChatService } from '../core/chat/chat.service';

@Controller('prompts')
export class PromptController {
  constructor(
    private readonly promptService: PromptService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  createPrompt(@Body() createPromptDto: CreatePromptDto) {
    return this.promptService.createPrompt(createPromptDto);
  }

  @Get()
  getAllPrompts() {
    return this.promptService.getAllPrompts();
  }
  @Post('/use')
  usePrompt(@Body() usePrompDto: UsePromptDto) {
    return this.chatService.usePrompt(usePrompDto);
  }

  @Get('/:promptId')
  getPromptById(@Param('promptId') promptId: string) {
    return this.promptService.getPromptById(promptId);
  }
}
