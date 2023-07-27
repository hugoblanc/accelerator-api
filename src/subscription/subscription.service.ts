import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    return user.subscription;
  }
}
