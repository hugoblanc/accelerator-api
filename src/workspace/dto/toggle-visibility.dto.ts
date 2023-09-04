import { WorkspaceVisibility } from '@prisma/client';

export class ToggleVisibilityDto {
  workspaceId: string;
  visibility: WorkspaceVisibility;
}
