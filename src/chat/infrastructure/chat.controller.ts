import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { ChatService } from '../application/chat.service';
import { UsePromptDto } from '../dto/use-prompt.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('start-chat/:promptId')
  usePrompt(
    @Body() usePrompDto: UsePromptDto,
    @Param('promptId', ParseUUIDPipe) promptId: string,
  ) {
    return this.chatService.usePrompt(promptId, usePrompDto);
  }

  @Post('short-term-memory')
  shortTermMemory(@Body() shortTermChatDto: ShortTermChatDto) {
    return this.chatService.continueChatting(shortTermChatDto);
  }

  @Post('continue-chatting')
  continueChatting(@Body() shortTermChatDto: ShortTermChatDto) {
    return this.chatService.continueChatting(shortTermChatDto);
  }
}
