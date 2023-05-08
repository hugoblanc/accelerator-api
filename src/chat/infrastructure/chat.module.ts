import { PromptAccessorModule } from '../../prompt/infrastructure/accessors/prompt-accessor.module';
import { ChatService } from '../application/chat.service';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PromptAccessorModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
