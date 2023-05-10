import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { PromptService } from '../application/prompt.service';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  createPrompt(@Body() createPromptDto: CreatePromptDto) {
    return this.promptService.createPrompt(createPromptDto);
  }

  @Get()
  getAllPrompts() {
    return this.promptService.getAllPrompts();
  }

  @Get('/:promptId')
  getPromptById(@Param('promptId') promptId: string) {
    return this.promptService.getPromptById(promptId);
  }
}
