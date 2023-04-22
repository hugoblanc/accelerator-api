import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UsePromptDto } from './dto/use-prompt.dto';
import { GptService } from '../core/openai/gpt.service';

@Injectable()
export class PromptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gpt: GptService,
  ) {}
  async createPrompt(createPromptDto: CreatePromptDto) {
    const variables = this.extractVariablesFromPrompt(createPromptDto.text);

    return this.prisma.prompt.create({
      data: {
        name: createPromptDto.name,
        text: createPromptDto.text,
        promptVariables: {
          createMany: {
            data: variables.map((variable) => ({ value: variable })),
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
  async usePrompt(promptId: string, usePrompDto: UsePromptDto) {
    let text = usePrompDto.text;
    console.log(text);

    const variables = usePrompDto.variables;
    variables.forEach((variable) => {
      console.log('look for ' + `[${variable.name}]`);

      text = text.replace(`[${variable.name}]`, variable.value);
    });

    console.log(text);

    const result = await this.gpt.callWithPrompt(text);
    return { result };
  }

  private extractVariablesFromPrompt(prompt: string) {
    const regex = /\[(.*?)\]/g;

    const variables = [];
    let match: RegExpExecArray;

    while ((match = regex.exec(prompt)) !== null) {
      variables.push(match[1]);
    }

    return variables;
  }
}
