import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Workspace, WorkspaceRole } from '@prisma/client';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ContextService } from '../core/context/context.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UserService } from '../user/application/user.service';
import { TeamService } from '../team/team.service';

@Injectable()
export class WorkspaceService {
  get workspaceId(): string {
    return this.context.workspaceId;
  }
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly teamService: TeamService,
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

  async invite(invitedId: string): Promise<void> {
    await this.prismaService.workspaceMember.create({
      data: {
        userId: invitedId,
        workspaceId: this.context.workspaceId,
        role: WorkspaceRole.user,
      },
    });
  }

  async inviteMember(inviteMemberDto: InviteMemberDto): Promise<void> {
    const user = await this.userService.getUserByEmail(inviteMemberDto.email);
    if (!user) {
      throw new Error('User not found');
    }
    // Add the user to the workspace
    await this.prismaService.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: this.context.workspaceId,
        role: WorkspaceRole.user,
      },
    });

    if (inviteMemberDto.teamId) {
      // Add the user to the team
      await this.teamService.addMemberToTeam(
        inviteMemberDto.teamId,
        user.id,
        inviteMemberDto.role,
      );
    }
  }

  async removeMember(memberId: string): Promise<void> {
    await this.prismaService.workspaceMember.delete({
      where: {
        id: memberId,
      },
    });
  }

  async getWorkspaceMembers(): Promise<any[]> {
    return this.prismaService.workspaceMember.findMany({
      where: {
        workspaceId: this.context.workspaceId,
      },
      select: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        role: true,
        id: true,
      },
    });
  }
}
