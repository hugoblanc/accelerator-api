import { Global, Module } from '@nestjs/common';
import { OpenaiModule } from './openai/openai.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContextModule } from './context/context.module';

@Global()
@Module({
  imports: [OpenaiModule, PrismaModule, ContextModule],
  controllers: [],
  providers: [],
  exports: [OpenaiModule, PrismaModule, ContextModule],
})
export class CoreModule {}
