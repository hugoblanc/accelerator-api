import { Global, Module } from '@nestjs/common';
import { GptService } from './gpt.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [GptService],
  exports: [GptService],
})
export class OpenaiModule {}
