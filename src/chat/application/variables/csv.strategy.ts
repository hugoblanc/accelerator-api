import { Document } from 'langchain/document';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { IDocumentLoader } from './i-document-loader';

import { CharacterTextSplitter } from 'langchain/text_splitter';

export class CsvStrategy implements IDocumentLoader {
  private loader: CSVLoader;
  constructor(blob: Blob) {
    this.loader = new CSVLoader(blob);
  }

  async load(): Promise<Document<Record<string, any>>[]> {
    const docs = await this.loader.load();

    const splitter = new CharacterTextSplitter({
      separator: '-------------------',
      chunkSize: 1000,
      chunkOverlap: 30,
    });
    const output = await splitter.mergeSplits(
      docs.map((d) => d.pageContent),
      '-------------------',
    );

    const newDocs = await splitter.createDocuments(output);

    return newDocs;
  }
}
