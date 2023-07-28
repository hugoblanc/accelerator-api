import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
