import { GptEngine } from './gpt-engine';
import { GPT4MaxContextToken } from './gpt.constants';

export class Gpt4Engine extends GptEngine {
  model = 'gpt-4';
  contextMaxToken = GPT4MaxContextToken;
}
