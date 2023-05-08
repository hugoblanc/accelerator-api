import { Body, Controller, Post } from '@nestjs/common';
import { ShortTermChatDto } from '../../prompt/dto/short-term-chat.dto';
import { ChatService } from './chat.service';
import { UsePromptDto } from './dto/use-prompt.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/start-chat')
  usePrompt(@Body() usePrompDto: UsePromptDto) {
    return this.chatService.usePrompt(usePrompDto);
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
