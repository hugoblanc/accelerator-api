import { VariableType } from '@prisma/client';

interface InjectableVariable {
  type: VariableType;
  key: string;
  value: string;
}

export class ChatInitializer {
  constructor(readonly template: string) {}

  renderPrompt(variables: InjectableVariable[]) {
    let result = this.template;

    for (const variable of variables) {
      result = result.replace(
        `${variable.type}(${variable.key})`,
        variable.value,
      );
    }

    return result;
  }
}
