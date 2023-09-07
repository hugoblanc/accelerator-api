import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

describe('WorkspaceController', () => {
  let workspaceController: WorkspaceController;
  let workspaceService: WorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            getAllWorkspaces: jest.fn(),
          },
        },
      ],
    }).compile();

    workspaceController = module.get<WorkspaceController>(WorkspaceController);
    workspaceService = module.get<WorkspaceService>(WorkspaceService);
  });

  describe('getAllWorkspaces', () => {
    it('should return an array of workspaces', async () => {
      const result = [{ id: '1', name: 'Workspace 1' }, { id: '2', name: 'Workspace 2' }];
      jest.spyOn(workspaceService, 'getAllWorkspaces').mockImplementation(() => Promise.resolve(result));

      expect(await workspaceController.getAllWorkspaces()).toBe(result);
    });

    it('should throw an error if the WorkspaceService throws an error', async () => {
      jest.spyOn(workspaceService, 'getAllWorkspaces').mockImplementation(() => Promise.reject(new Error('Test error')));

      await expect(workspaceController.getAllWorkspaces()).rejects.toThrow('Test error');
    });
  });
});
