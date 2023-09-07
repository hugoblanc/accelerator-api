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
import { Workspace } from '@prisma/client';
import { JwtAuthGuard } from '../core/security/guards/jwt-auth.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceService } from './workspace.service';
import { IsInWorkspace } from './guard/is-user-in-workspace.guard';
import { InviteMemberDto } from './dto/invite-member.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getCurrentUserWorkspaces(): Promise<Workspace[]> {
    return this.workspaceService.getCurrentUserWorkspaces();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createWorkspace(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    return this.workspaceService.createWorkspace(createWorkspaceDto);
  }

  @Put('invite-member/:invitedId')
  @UseGuards(JwtAuthGuard)
  invite(@Param('newUserId', ParseUUIDPipe) invitedId: string): Promise<void> {
    return this.workspaceService.invite(invitedId);
  }

  @Put('invite')
  @UseGuards(JwtAuthGuard)
  inviteMember(@Body() inviteMemberDto: InviteMemberDto): Promise<void> {
    return this.workspaceService.inviteMember(inviteMemberDto);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  getWorkspaceMembers(): Promise<any[]> {
    return this.workspaceService.getWorkspaceMembers();
  }

  @Get('members/count')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  getWorkspaceMemberCount(): Promise<number> {
    return this.workspaceService.getWorkspaceMemberCount();
  }

  @Delete('members/:memberId')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  removeMember(
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ): Promise<void> {
    return this.workspaceService.removeMember(memberId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllWorkspaces(): Promise<Workspace[]> {
    return this.workspaceService.getAllWorkspaces();
  }
}
