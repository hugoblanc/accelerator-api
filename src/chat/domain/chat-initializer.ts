import { BadRequestException } from '@nestjs/common';
import { GPTModel, VariableType } from '@prisma/client';
import {
  GPT35TurboMaxContextToken,
  GPT4MaxContextToken,
} from '../../core/openai/gpt/gpt.constants';

interface InjectableVariable {
  type: VariableType;
  key: string;
  value: string;
}

export class ChatInitializer {
  private contextMaxToken: number;
  private outputMinSize = 500 * 3;

  get shouldBatchPrompt(): boolean {
    const variableLength = this.variables.reduce(
      (acc, variable) => acc + variable.value.length,
      0,
    );
    const templateLength = this.template.length;

    return (
      variableLength + templateLength > this.maxCharLength - this.outputMinSize
    );
  }

  get textVariables(): InjectableVariable[] {
    return this.variables.filter((variable) => variable.type === 'text');
  }

  get longTextVariables(): InjectableVariable[] {
    return this.variables.filter((variable) => variable.type === 'longText');
  }

  get maxCharLength(): number {
    return this.contextMaxToken * 3;
  }

  constructor(
    readonly template: string,
    readonly variables: InjectableVariable[],
    readonly model: GPTModel,
  ) {
    if (model === GPTModel.GPT4) {
      this.contextMaxToken = GPT4MaxContextToken;
    } else {
      this.contextMaxToken = GPT35TurboMaxContextToken;
    }
  }

  renderPrompt(): string[] {
    let result = this.template;
    for (const variable of this.textVariables) {
      result = result.replace(
        `${variable.type}(${variable.key})`,
        variable.value,
      );
    }

    if (this.longTextVariables.length === 0) {
      return [result];
    }

    if (this.longTextVariables.length > 1) {
      throw new BadRequestException('Only one long text variable is allowed');
    }
    return this.generateChunkedPrompt(result, this.longTextVariables[0]);
  }

  renderTemplate(): string {
    let template = this.template;
    for (const variable of this.textVariables) {
      template = template.replace(
        `${variable.type}(${variable.key})`,
        `{${variable.key}}`,
      );
    }

    if (this.longTextVariables.length > 0) {
      throw new BadRequestException('Not compatible with long text');
    }

    return template;
  }

  private generateChunkedPrompt(
    template: string,
    longTextVariable: InjectableVariable,
  ): string[] {
    const maxSizeBatch =
      this.contextMaxToken - this.outputMinSize - template.length;
    const chunks = chunkLargeString(longTextVariable.value, maxSizeBatch);

    return chunks.map((chunk) => {
      let result = template;
      result = result.replace(
        `${longTextVariable.type}(${longTextVariable.key})`,
        chunk,
      );
      return result;
    });
  }
}

function chunkLargeString(largeString: string, maxCharLength: number) {
  const chunks = [];
  let i = 0;
  while (i < largeString.length) {
    chunks.push(largeString.slice(i, i + maxCharLength));
    i += maxCharLength;
  }
  return chunks;
}
