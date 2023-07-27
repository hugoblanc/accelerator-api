import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
