import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../../core/security/guards/subscription.guard';
import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { ChatService } from '../application/chat.service';
import { UsePromptDto, UsePromptDtoV2 } from '../dto/use-prompt.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { VariableValorizerService } from '../application/variables/variable-valorizer.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly valorizer: VariableValorizerService,
  ) {}

  @Post('start-chat/:promptId')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  usePrompt(
    @Body() usePrompDto: UsePromptDto,
    @Param('promptId', ParseUUIDPipe) promptId: string,
  ) {
    return this.chatService.usePrompt(promptId, usePrompDto);
  }

  @Post('continue-chatting/:promptId')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  continueChatting(
    @Body() shortTermChatDto: ShortTermChatDto,
    @Param('promptId', ParseUUIDPipe) promptId: string,
  ) {
    return this.chatService.continueChatting(shortTermChatDto, promptId);
  }

  @Post('start-prompt-v2/:promptId')
  @UseInterceptors(AnyFilesInterceptor())
  test(
    @Param('promptId', ParseUUIDPipe) promptId: string,
    @Body() usePrompDto: UsePromptDtoV2,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);

    return this.chatService.usePromptV2(promptId, usePrompDto, files);
  }
}
