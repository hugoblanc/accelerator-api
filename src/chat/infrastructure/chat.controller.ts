import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../../core/security/guards/subscription.guard';
import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { ChatService } from '../application/chat.service';
import { UsePromptDto } from '../dto/use-prompt.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
}
