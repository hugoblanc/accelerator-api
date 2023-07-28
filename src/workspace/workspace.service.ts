import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Workspace, WorkspaceRole } from '@prisma/client';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ContextService } from '../core/context/context.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly context: ContextService,
  ) {}

  async getCurrentUserWorkspaces(): Promise<Workspace[]> {
    return this.prismaService.workspace.findMany({
      where: {
        members: {
          some: {
            userId: this.context.userId,
          },
        },
      },
    });
  }

  async createWorkspace(
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const workspace = await this.prismaService.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        members: {
          create: {
            userId: this.context.userId,
            role: WorkspaceRole.admin,
          },
        },
      },
    });
    return workspace;
  }

  async inviteMember(invitedId: string): Promise<void> {
    await this.prismaService.workspaceMember.create({
      data: {
        userId: invitedId,
        workspaceId: this.context.workspaceId,
        role: WorkspaceRole.user,
      },
    });
  }
}
