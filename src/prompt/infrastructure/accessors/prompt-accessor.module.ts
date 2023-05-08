import { Module } from '@nestjs/common';
import { PromptRepository } from './prompt.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [PromptRepository],
  exports: [PromptRepository],
})
export class PromptAccessorModule {}
