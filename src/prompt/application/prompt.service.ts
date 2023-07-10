import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { PromptTemplate } from '../domain/prompt-template';
import { CreatePromptDto } from '../infrastructure/dto/create-prompt.dto';
import { gptModelMap } from '../../core/openai/gpt/gtp-model.enum';
import { Prisma, Prompt } from '@prisma/client';

@Injectable()
export class PromptService {
  constructor(private readonly prisma: PrismaService) {}
  async createPrompt(createPromptDto: CreatePromptDto, userId: string) {
    const template = new PromptTemplate(createPromptDto.text);
    const variables = template.variables;
    const model = gptModelMap.get(createPromptDto.model);

    return this.prisma.prompt.create({
      data: {
        name: createPromptDto.name,
        text: createPromptDto.text,
        description: createPromptDto.description,
        model,
        promptVariables: {
          createMany: {
            data: variables.map((variable) => ({
              key: variable.key,
              value: variable.key,
              type: variable.type,
            })),
          },
        },
        categories: {
          connect: createPromptDto.categoryIds.map((id) => ({ id })),
          create: createPromptDto.categoryNamesToCreate?.map((name) => ({
            name,
          })),
        },
        userId: userId,
        opened: createPromptDto.opened,
      },
    });
  }

  getPromptByIds(promptIds: string[]) {
    return this.prisma.prompt.findMany({
      where: {
        id: { in: promptIds },
      },
      include: {
        promptVariables: true,
        categories: true,
      },
    });
  }

  getPromptById(promptId: string) {
    return this.prisma.prompt.findUnique({
      where: {
        id: promptId,
      },
      include: {
        promptVariables: true,
      },
    });
  }

  /**
   * Get all prompts that are opened
   */
  getAllPrompts() {
    return this.prisma.prompt.findMany({
      where: {
        opened: true,
      },
      include: {
        promptVariables: true,
        categories: true,
      },
    });
  }

  getMyPrompts(userId: string) {
    return this.prisma.prompt.findMany({
      where: {
        userId: userId,
      },
      include: {
        promptVariables: true,
        categories: true,
      },
    });
  }

  deletePrompt(promptId: string, userId: string) {
    // TODO fix this for security
    return this.prisma.prompt.delete({
      where: {
        id: promptId,
      },
    });
  }

  async fork(promptId: string, userId: string): Promise<Prompt> {
    const originalPrompt = await this.prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        promptVariables: true,
        categories: true,
      },
    });
    if (!originalPrompt) {
      throw new NotFoundException('Original prompt not found');
    }

    const forkedPrompt: Prisma.PromptCreateArgs = {
      data: {
        text: originalPrompt.text,
        name: originalPrompt.name,
        description: originalPrompt.description,
        model: originalPrompt.model,
        modelAnswer: originalPrompt.modelAnswer,
        promptVariables: {
          createMany: {
            data: originalPrompt.promptVariables.map((variable) => ({
              key: variable.key,
              value: variable.value,
              type: variable.type,
            })),
          },
        },
        categories: {
          connect: originalPrompt.categories.map((category) => ({
            id: category.id,
          })),
        },
        userId: userId, // Put the new user id
        opened: false,
      },
    };

    // Save the fork
    const fork = await this.prisma.prompt.create(forkedPrompt);
    console.log(fork);

    return fork;
  }
}
