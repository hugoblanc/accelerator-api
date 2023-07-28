import { ContextHttpRequestMiddleware } from './context.middleware';
import { ContextService } from './context.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [ContextService, ContextHttpRequestMiddleware],
  exports: [ContextService],
})
export class ContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
