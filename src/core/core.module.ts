import { Module } from '@nestjs/common';
import { OpenaiModule } from './openai/openai.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [OpenaiModule, PrismaModule],
  controllers: [],
  providers: [],
  exports: [OpenaiModule, PrismaModule],
})
export class CoreModule {}
