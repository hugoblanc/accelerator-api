import { VariableType } from '@prisma/client';
import { PromptTemplate, Variable } from './prompt-template';

describe('PromptTemplate', () => {
  it('should allow template creation without variables', () => {
    const aTemplateWithoutVariables = 'This is a template without variables';
    const promptTemplate = new PromptTemplate(aTemplateWithoutVariables);
    expect(promptTemplate).toBeDefined();
  });

  it('should extract text variable from template', () => {
    const aTemplateWithTextVariable = 'This is a template with text(key1).';
    const promptTemplate = new PromptTemplate(aTemplateWithTextVariable);
    expect(promptTemplate.variables).toEqual([{ type: 'text', key: 'key1' }]);
  });

  it('should extract longText variable from template', () => {
    const aTemplateWithLongTextVariable =
      'This is a template with longText(key2).';
    const promptTemplate = new PromptTemplate(aTemplateWithLongTextVariable);
    expect(promptTemplate.variables).toEqual([
      { type: 'longText', key: 'key2' },
    ]);
  });

  it('should extract multiple variables from template', () => {
    const aTemplateWithMultipleVariables =
      'This is a template with text(key1) and longText(key2). And again text(key3) and longText(key4).';
    const promptTemplate = new PromptTemplate(aTemplateWithMultipleVariables);
    console.error(promptTemplate.variables);

    expect(promptTemplate.variables).toEqual([
      Variable.create({ type: VariableType.text, key: 'key1' }),
      Variable.create({ type: VariableType.text, key: 'key3' }),
      Variable.create({ type: VariableType.longText, key: 'key2' }),
      Variable.create({ type: VariableType.longText, key: 'key4' }),
    ]);
  });
});
