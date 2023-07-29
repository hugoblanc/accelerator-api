import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {Workspace} from '@prisma/client';
import {JwtAuthGuard} from '../core/security/guards/jwt-auth.guard';
import {CreateWorkspaceDto} from './dto/create-workspace.dto';
import {WorkspaceService} from './workspace.service';
import {IsInWorkspace} from "./guard/is-user-in-workspace.guard";

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {
  }

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
  inviteMember(
    @Param('newUserId', ParseUUIDPipe) invitedId: string,
  ): Promise<void> {
    return this.workspaceService.inviteMember(invitedId);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, IsInWorkspace)
  getWorkspaceMembers(): Promise<any[]> {
    return this.workspaceService.getWorkspaceMembers();
  }
}
