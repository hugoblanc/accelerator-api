import { BadRequestException } from '@nestjs/common';
import { VariableType } from '@prisma/client';

interface InjectableVariable {
  type: VariableType;
  key: string;
  value: string;
}

export class ChatInitializer {
  private contextMaxSize = 4000;
  private outputMinSize = 500;

  get shouldBatchPrompt(): boolean {
    const variableLength = this.variables.reduce(
      (acc, variable) => acc + variable.value.length,
      0,
    );
    const templateLength = this.template.length;

    return (
      variableLength + templateLength > this.contextMaxSize - this.outputMinSize
    );
  }

  get textVariables(): InjectableVariable[] {
    return this.variables.filter((variable) => variable.type === 'text');
  }

  get longTextVariables(): InjectableVariable[] {
    return this.variables.filter((variable) => variable.type === 'longText');
  }

  constructor(
    readonly template: string,
    readonly variables: InjectableVariable[],
  ) {}

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

  private generateChunkedPrompt(
    template: string,
    longTextVariable: InjectableVariable,
  ): string[] {
    const maxSizeBatch =
      this.contextMaxSize - this.outputMinSize - template.length;
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
