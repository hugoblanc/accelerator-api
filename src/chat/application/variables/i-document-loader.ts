import { Document } from 'langchain/document';

export interface IDocumentLoader {
  load(): Promise<Document<Record<string, any>>[]>;
}
