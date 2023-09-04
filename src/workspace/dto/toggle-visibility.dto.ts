import { WorkspaceVisibility } from '@prisma/client';

export class ToggleVisibilityDto {
  @IsString()
  workspaceId: string;

  @IsEnum(WorkspaceVisibility)
  visibility: WorkspaceVisibility;
}
