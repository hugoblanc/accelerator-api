import { GptEngine } from './gpt-engine';

export class Gpt35Engine extends GptEngine {
  model = 'gpt-3.5-turbo';
  contextMaxCharSize = 4000;
}
