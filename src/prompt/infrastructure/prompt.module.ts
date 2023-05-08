import { PromptService } from '../application/prompt.service';
import { PromptAccessorModule } from './accessors/prompt-accessor.module';
import { PromptController } from './prompt.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PromptAccessorModule],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}
