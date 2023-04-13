import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}
