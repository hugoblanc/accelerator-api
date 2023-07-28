import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
