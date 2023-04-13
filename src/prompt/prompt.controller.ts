import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PromptService } from 'src/prompt/prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UsePromptDto } from './dto/use-prompt.dto';

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

  @Post('/use/:promptId')
  usePrompt(
    @Param('promptId') promptId: string,
    @Body() usePrompDto: UsePromptDto,
  ) {
    return this.promptService.usePrompt(promptId, usePrompDto);
  }
}
