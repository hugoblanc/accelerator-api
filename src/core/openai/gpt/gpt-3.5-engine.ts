import { GptEngine } from './gpt-engine';
import { GPT35TurboMaxContextToken } from './gpt.constants';

export class Gpt35Engine extends GptEngine {
  model = 'gpt-3.5-turbo';
  contextMaxToken = GPT35TurboMaxContextToken;
}
