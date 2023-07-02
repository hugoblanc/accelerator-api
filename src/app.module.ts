import { PromptAccessorModule } from './prompt/infrastructure/accessors/prompt-accessor.module';
import {MiddlewareConsumer, Module, NestModule, ValidationPipe} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { ChatModule } from './chat/infrastructure/chat.module';
import { CoreModule } from './core/core.module';
import { GptService } from './core/openai/gpt.service';
import { CategoryModule } from './prompt/category/category.module';
import { PromptModule } from './prompt/infrastructure/prompt.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './core/security/jwt.middleware';
import { AuthModule } from './core/security/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    ChatModule,
    CategoryModule,
    PromptModule,
    UserModule,
    AuthModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
