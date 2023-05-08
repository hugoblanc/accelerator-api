import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class PromptRepository {
  constructor(private readonly prisma: PrismaService) {}

  public findPromptById(id: string) {
    return this.prisma.prompt.findUnique({
      where: {
        id,
      },
      include: {
        promptVariables: true,
      },
    });
  }
}
