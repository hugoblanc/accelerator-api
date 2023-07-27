import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserId } from '../core/security/decorator/user-id.decorator';
import { JwtAuthGuard } from '../core/security/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentSubscription(@UserId() userId: string) {
    return this.subscriptionService.getCurrentSubscription(userId);
  }
}
