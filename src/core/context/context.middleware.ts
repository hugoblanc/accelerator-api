import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ContextService } from './context.service';

@Injectable()
export class ContextHttpRequestMiddleware
  implements NestMiddleware<Request, Response>
{
  private readonly logger = new Logger(ContextHttpRequestMiddleware.name);

  constructor(private readonly contextService: ContextService) {}

  use(request: Request, _res: Response, next: NextFunction): void {
    this.contextService.init(() => {
      this.logger.debug(`Context created - `);
      next();
    });
  }
}
