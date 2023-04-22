import { Body, Controller, Post } from '@nestjs/common';
import { ShortTermChatDto } from '../../prompt/dto/short-term-chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('short-term-memory')
  shortTermMemory(@Body() shortTermChatDto: ShortTermChatDto) {
    return this.chatService.shortTermChat(shortTermChatDto);
  }
}
