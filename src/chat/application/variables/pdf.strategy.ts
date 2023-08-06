import { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { IDocumentLoader } from './i-document-loader';

export class PdfStrategy implements IDocumentLoader {
  private loader: PDFLoader;
  constructor(blob: Blob) {
    this.loader = new PDFLoader(blob);
  }

  load(): Promise<Document<Record<string, any>>[]> {
    return this.loader.load();
  }
}
