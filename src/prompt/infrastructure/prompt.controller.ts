import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserId } from '../../core/security/decorator/user-id.decorator';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { PromptService } from '../application/prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { EditPromptDto } from './dto/edit-prompt.dto';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createPrompt(
    @Body() createPromptDto: CreatePromptDto,
    @UserId() userId: string,
  ) {
    return this.promptService.createPrompt(createPromptDto, userId);
  }

  @Put('edit')
  @UseGuards(JwtAuthGuard)
  editPrompt(@Body() editPromptDto: EditPromptDto, @UserId() userId: string) {
    return this.promptService.editPrompt(editPromptDto, userId);
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
  getMyPrompts(@UserId() userId: string) {
    return this.promptService.getMyPrompts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePrompt(@Param('id') promptId: string, @UserId() userId: string) {
    return this.promptService.deletePrompt(promptId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fork/:id')
  fork(@Param('id') promptId: string, @UserId() userId: string) {
    return this.promptService.fork(promptId, userId);
  }
}
