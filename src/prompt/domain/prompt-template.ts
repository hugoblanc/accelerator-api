import { VariableType } from '@prisma/client';

export class PromptTemplate {
  public variables: Variable[];
  constructor(readonly template: string, _variables?: string[]) {
    if (!_variables) {
      this.variables = this.extractVariablesFromTemplate();
    }
  }

  extractVariablesFromTemplate(): Variable[] {
    const results: Variable[] = [];
    const variableTypes = Array.from(variableDictionary.keys());

    for (const type of variableTypes) {
      const regexMatcher = variableDictionary.get(type);
      const variables = this.findVariableFromRegex(regexMatcher);
      if (variables.length > 0) {
        results.push(
          ...variables.map((variable) => {
            return Variable.create({ type, key: variable });
          }),
        );
      }
    }

    return results;
  }

  findVariableFromRegex(regex: RegExp): string[] {
    const variables: string[] = [];
    let match: RegExpExecArray;

    while ((match = regex.exec(this.template)) !== null) {
      variables.push(match[1]);
    }

    return variables;
  }
}

interface VariableProps {
  type: VariableType;
  key: string;
}

export const variableDictionary = new Map<VariableType, RegExp>([
  [VariableType.text, /\btext\(([^)]*)\)/gi],
  [VariableType.longText, /\blongText\(([^)]*)\)/gi],
]);

export class Variable {
  private constructor(readonly type: VariableType, readonly key: string) {}

  static create(props: VariableProps) {
    return new Variable(props.type, props.key);
  }
}
