import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class IsInWorkspace implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    console.log(req.header);
    console.log(req.headers);

    this.prisma.workspace.findUnique({
      where: {
        id: req.header.workspaceId,
      },
      select: {
        members: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    return true;
  }
}
