import { GPTModel as PrismaGPTModel } from '@prisma/client';
export enum GPTModel {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
}

export const gptModelMap = new Map<GPTModel, PrismaGPTModel>([
  [GPTModel.GPT35Turbo, PrismaGPTModel.GPT35],
  [GPTModel.GPT4, PrismaGPTModel.GPT4],
]);

export const mapGptModel = new Map<PrismaGPTModel, GPTModel>([
  [PrismaGPTModel.GPT35, GPTModel.GPT35Turbo],
  [PrismaGPTModel.GPT4, GPTModel.GPT4],
]);
