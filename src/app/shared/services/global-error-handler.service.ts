import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    // TODO: use toast service to show error to user
    console.error('Error from global error handler', error);
  }
}
