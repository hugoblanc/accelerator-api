import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { PromptService } from '../application/prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { EditPromptDto } from './dto/edit-prompt.dto';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createPrompt(@Body() createPromptDto: CreatePromptDto, @Req() req) {
    return this.promptService.createPrompt(createPromptDto, req.user.userId);
  }

  @Put('edit')
  @UseGuards(JwtAuthGuard)
  editPrompt(@Body() editPromptDto: EditPromptDto, @Req() req) {
    return this.promptService.editPrompt(editPromptDto, req.user.userId);
  }

  @Get()
  getAllPrompts() {
    return this.promptService.getAllPrompts();
  }

  @Get('/id/:promptId')
  getPromptById(@Param('promptId') promptId: string) {
    return this.promptService.getPromptById(promptId);
  }

  @Get('/to-edit/:promptId')
  getPromptToEdit(@Param('promptId') promptId: string) {
    return this.promptService.getPromptToEdit(promptId);
  }

  @Post('/ids')
  getByIds(@Body() promptIds: string[]) {
    return this.promptService.getPromptByIds(promptIds);
  }

  @Get('/myPrompts')
  @UseGuards(JwtAuthGuard)
  getMyPrompts(@Req() req) {
    return this.promptService.getMyPrompts(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePrompt(@Param('id') promptId: string, @Req() req) {
    return this.promptService.deletePrompt(promptId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fork/:id')
  fork(@Param('id') promptId: string, @Req() req) {
    return this.promptService.fork(promptId, req.user.userId);
  }
}
