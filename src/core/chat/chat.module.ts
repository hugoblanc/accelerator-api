import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
