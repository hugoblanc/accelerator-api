import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SubscriptionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;

    const user = await this.getUserWithSubscription(userId);

    if (!user.subscription) {
      return true;
    }

    if (this.isTrialSubscriptionExhausted(user.subscription)) {
      return false;
    }

    await this.decrementSubscriptionCredit(userId);
    return true;
  }

  private async getUserWithSubscription(userId: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { subscription: true },
    });
  }

  private isTrialSubscriptionExhausted(subscription: any) {
    return (
      subscription.type == SubscriptionType.trial &&
      subscription.creditLeft <= 0
    );
  }

  private async decrementSubscriptionCredit(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription: {
          update: {
            creditLeft: { decrement: 1 },
          },
        },
      },
    });
  }
}
