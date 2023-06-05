import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { PromptTemplate } from '../domain/prompt-template';
import { CreatePromptDto } from '../infrastructure/dto/create-prompt.dto';

@Injectable()
export class PromptService {
  constructor(private readonly prisma: PrismaService) {}
  async createPrompt(createPromptDto: CreatePromptDto) {
    const template = new PromptTemplate(createPromptDto.text);
    const variables = template.variables;

    return this.prisma.prompt.create({
      data: {
        name: createPromptDto.name,
        text: createPromptDto.text,
        description: createPromptDto.description,
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

  getAllPrompts() {
    return this.prisma.prompt.findMany({
      include: {
        promptVariables: true,
        categories: true,
      },
    });
  }
}
