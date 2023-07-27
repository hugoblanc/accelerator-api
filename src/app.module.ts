import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { ChatModule } from './chat/infrastructure/chat.module';
import { CoreModule } from './core/core.module';
import { GptService } from './core/openai/gpt.service';
import { AuthModule } from './core/security/auth/auth.module';
import { JwtMiddleware } from './core/security/jwt.middleware';
import { CategoryModule } from './prompt/category/category.module';
import { PromptModule } from './prompt/infrastructure/prompt.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    SubscriptionModule,
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
