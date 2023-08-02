import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/application/user.service';
import { TeamService } from '../team/team.service';
import { AuthService } from '../core/security/auth/auth.service';

@Module({
  imports: [],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, UserService, TeamService, AuthService],
})
export class WorkspaceModule {}
