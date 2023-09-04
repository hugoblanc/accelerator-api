import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Team } from '@prisma/client';
import { JwtAuthGuard } from '../core/security/guards/jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';
import { IsInWorkspace } from '../workspace/guard/is-user-in-workspace.guard';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  getMyTeams(): Promise<Team[]> {
    return this.teamService.getMyTeams();
  }

  @Get(':teamId')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  getTeam(@Param('teamId', ParseUUIDPipe) teamId: string): Promise<Team> {
    return this.teamService.getTeam(teamId);
  }

  @Get('workspace/:workspaceId')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  getWorkspaceTeams(): Promise<Team[]> {
    return this.teamService.getWorkspaceTeams();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.createTeam(createTeamDto);
  }

  @Get(':teamId/members')
  @UseGuards(JwtAuthGuard)
  getTeamMembers(
    @Param('teamId', ParseUUIDPipe) teamId: string,
  ): Promise<any[]> {
    return this.teamService.getTeamMembers(teamId);
  }

  @Delete(':teamId')
  @UseGuards(JwtAuthGuard)
  delete(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.teamService.delete(teamId);
  }

  @Delete('member/:memberId')
  @UseGuards(JwtAuthGuard)
  removeMember(@Param('memberId', ParseUUIDPipe) memberId: string) {
    return this.teamService.removeMember(memberId);
  }

  @Put(':teamId')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  updateTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamService.updateTeam(teamId, updateTeamDto);
  }
}
