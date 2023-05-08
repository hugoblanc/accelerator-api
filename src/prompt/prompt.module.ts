import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { Module } from '@nestjs/common';
import { ChatModule } from '../core/chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}
