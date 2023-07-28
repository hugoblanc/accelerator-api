import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
}
