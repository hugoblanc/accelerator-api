import { CategoryModule } from './core/category/category.module';
import { GptService } from './core/openai/gpt.service';
import { OpenaiModule } from './core/openai/openai.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { PromptModule } from './prompt/prompt.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [CategoryModule, OpenaiModule, PrismaModule, PromptModule],
  controllers: [AppController],
  providers: [
    GptService,
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
