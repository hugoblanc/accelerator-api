import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<{
    userId: string;
    workspaceId: string;
  }>();

  init<R>(next: () => R): R {
    return this.asyncLocalStorage.run(
      { userId: null, workspaceId: null },
      next,
    );
  }

  setUserId(userId: string): void {
    this.context.userId = userId;
  }

  setWorkspaceId(workspaceId: string): void {
    this.context.workspaceId = workspaceId;
  }

  get workspaceId(): string {
    const workspaceId = this.context.workspaceId;
    if (!workspaceId) {
      throw new Error('Workspace ID not found in context');
    }
    return workspaceId;
  }

  get userId(): string {
    const userId = this.context.userId;
    if (!userId) {
      throw new Error('User ID not found in context');
    }
    return userId;
  }

  get context() {
    const context = this.asyncLocalStorage.getStore();
    if (!context) {
      throw new Error(
        'The context must be initialized before calling AgicapContextService.context',
      );
    }
    return context;
  }
}
