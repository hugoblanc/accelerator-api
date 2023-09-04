import { Injectable } from '@nestjs/common';
import { Team, TeamMember } from '@prisma/client';
import { ContextService } from '../core/context/context.service';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  get userId(): string {
    return this.context.userId;
  }
  get workspaceId(): string {
    return this.context.workspaceId;
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly context: ContextService,
  ) {}

  async getMyTeams(): Promise<Team[]> {
    const teams = await this.prismaService.team.findMany({
      where: {
        workspaceId: this.workspaceId,
        members: {
          some: {
            userId: this.userId,
          },
        },
      },
    });

    return teams;
  }

  async getTeam(teamId: string): Promise<Team> {
    const team = await this.prismaService.team.findUnique({
      where: {
        id: teamId,
      },
    });

    return team;
  }

  async getWorkspaceTeams(): Promise<Team[]> {
    const teams = await this.prismaService.team.findMany({
      where: {
        workspaceId: this.workspaceId,
      },
    });

    return teams;
  }

  getTeamMembers(teamId: string): Promise<any[]> {
    return this.prismaService.teamMember.findMany({
      where: {
        teamId,
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

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = await this.prismaService.team.create({
      data: {
        name: createTeamDto.name,
        workspaceId: this.workspaceId,
        members: {
          create: [
            {
              userId: this.userId,
              role: 'admin',
            },
          ],
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return team;
  }

  async addMemberToTeam(
    teamId: string,
    userId: string,
    role: 'user' | 'admin',
  ): Promise<TeamMember> {
    const teamMember = await this.prismaService.teamMember.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        team: {
          connect: {
            id: teamId,
          },
        },
        role,
      },
    });

    return teamMember;
  }

  async delete(teamId: string) {
    await this.prismaService.team.delete({
      where: {
        id: teamId,
      },
    });
  }

  async removeMember(memberId: string): Promise<void> {
    await this.prismaService.teamMember.delete({
      where: {
        id: memberId,
      },
    });
  }
  
  async updateTeam(teamId: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    return this.prismaService.team.update({
      where: { id: teamId },
      data: { name: updateTeamDto.name },
    });
  }

  async removeMemberFromAllTeams(userId: string): Promise<void> {
    const teamIds = await this.getWorkspaceTeams();
    for (const team of teamIds) {
      await this.prismaService.teamMember.deleteMany({
        where: {
          teamId: team.id,
          userId: userId,
        },
      });
    }
  }

  // async getTeamMembers(teamId: string): Promise<User[]> {
  //   const members = await this.prismaService.teamMember.findMany({
  //     where: {
  //       teamId,
  //     },
  //     include: {
  //       user: true,
  //     },
  //   });

  //   return members.map((member) => member.user);
  // }
}
