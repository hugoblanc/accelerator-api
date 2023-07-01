import { PromptAccessorModule } from './prompt/infrastructure/accessors/prompt-accessor.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { ChatModule } from './chat/infrastructure/chat.module';
import { CoreModule } from './core/core.module';
import { GptService } from './core/openai/gpt.service';
import { CategoryModule } from './prompt/category/category.module';
import { PromptModule } from './prompt/infrastructure/prompt.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    ChatModule,
    CategoryModule,
    PromptModule,
    UserModule,
  ],
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
