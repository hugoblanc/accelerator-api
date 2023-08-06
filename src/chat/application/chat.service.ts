import { Injectable } from '@nestjs/common';
import { VariableType } from '@prisma/client';
import { LLMChain, OpenAI, PromptTemplate } from 'langchain';
import { loadQAMapReduceChain, loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { GptService } from '../../core/openai/gpt.service';
import { PromptRepository } from '../../prompt/infrastructure/accessors/prompt.repository';
import { ShortTermChatDto } from '../../prompt/infrastructure/dto/short-term-chat.dto';
import { ChatInitializer } from '../domain/chat-initializer';
import { UsePromptDto, UsePromptDtoV2 } from '../dto/use-prompt.dto';
import { VariableValorizerService } from './variables/variable-valorizer.service';
import { CharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class ChatService {
  constructor(
    private readonly gpt: GptService,
    private readonly promptRepository: PromptRepository,
    private readonly valorizer: VariableValorizerService,
  ) {}

  async continueChatting(shortTermChat: ShortTermChatDto, promptId: string) {
    const promptTemplate = await this.promptRepository.findPromptById(promptId);
    const result = await this.gpt.callShortTermMemory(
      shortTermChat,
      promptTemplate.model,
    );
    return { result };
  }

  async usePrompt(promptId: string, usePrompDto: UsePromptDto) {
    const promptTemplate = await this.promptRepository.findPromptById(promptId);

    const initializer = new ChatInitializer(
      promptTemplate.text,
      usePrompDto.variables,
      promptTemplate.model,
    );
    const prompt = initializer.renderPrompt();
    const result = await this.gpt.callWithPrompts(prompt, promptTemplate.model);
    return { result };
  }

  async usePromptV2(
    promptId: string,
    usePrompDto: UsePromptDtoV2,
    files: Express.Multer.File[],
  ) {
    const promptTemplate = await this.promptRepository.findPromptById(promptId);

    const variables = promptTemplate.promptVariables.filter(
      (v) => v.type === VariableType.csv || v.type === VariableType.pdf,
    );
    let documents: Document<Record<string, any>>[] = [];
    for (const variable of variables) {
      const docs = await this.valorizer.load(variable, files);
      documents = docs;
    }
    const initializer = new ChatInitializer(
      promptTemplate.text,
      usePrompDto.variables,
      promptTemplate.model,
    );
    const template = initializer.renderTemplate();

    const llm = new OpenAI({
      temperature: 0.9,
      streaming: true,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = PromptTemplate.fromTemplate(template);

    const values = usePrompDto.variables
      .filter((v) => v.type === VariableType.text)
      .reduce((acc, v) => {
        acc[v.key] = v.value;
        return acc;
      }, {} as Record<string, string>);

    if (documents.length > 0) {
      const splitter = new CharacterTextSplitter({ chunkSize: 2000 });
      const split = documents.map((d) => d.pageContent);
      const splits = await splitter.mergeSplits(split, '\n');
      documents = await splitter.createDocuments(splits);
      const chain = loadQAMapReduceChain(llm, { verbose: true });

      const promptValues = prompt.formatPromptValue(values);

      const question = (await promptValues).toString();

      const chainResult = await chain.call({
        input_documents: documents,
        question,
      });

      return { result: chainResult.text };
    } else {
      console.log('Using LLM');
      const chain = new LLMChain({ llm, prompt });
      return chain.call(values);
    }
  }
}
