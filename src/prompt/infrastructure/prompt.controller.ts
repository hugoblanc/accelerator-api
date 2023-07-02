import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { PromptService } from '../application/prompt.service';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  createPrompt(@Body() createPromptDto: CreatePromptDto) {
    return this.promptService.createPrompt(createPromptDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllPrompts(@Req() request: Request) {
    console.log(request['user']);
    return this.promptService.getAllPrompts();
  }

  @Get('/:promptId')
  getPromptById(@Param('promptId') promptId: string) {
    return this.promptService.getPromptById(promptId);
  }

  @Post('/ids')
  getByIds(@Body() promptIds: string[]) {
    return this.promptService.getPromptByIds(promptIds);
  }
}
