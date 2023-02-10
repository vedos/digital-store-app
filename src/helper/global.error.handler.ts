import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }
  handleError(error: any) {
    const logger = this.injector.get(LoggingService);
    logger.logError(error);
  }
}