import { Injectable } from '@nestjs/common';
import { Variable } from '../../../prompt/domain/prompt-template';
import { CsvStrategy } from './csv.strategy';
import { IDocumentLoader } from './i-document-loader';
import { PdfStrategy } from './pdf.strategy';
import { Document } from 'langchain/document';

@Injectable()
export class VariableValorizerService {
  mimeMapStrategy = new Map<string, new (b: Blob) => IDocumentLoader>([
    ['application/pdf', PdfStrategy],
  ]);
  // ['text/csv', CsvStrategy],

  async load(
    variable: Variable,
    files: Express.Multer.File[],
  ): Promise<Document<Record<string, any>>[]> {
    const key = variable.key;
    const file = files.find((file) => file.fieldname === key);

    const Strategy = this.mimeMapStrategy.get(file.mimetype);
    const buffer = file.buffer;

    const blob = new Blob([buffer], { type: file.mimetype });
    const loader = new Strategy(blob);
    const docs = await loader.load();
    return docs;
  }
}
