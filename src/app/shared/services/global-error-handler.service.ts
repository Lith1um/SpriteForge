import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  toastService = inject(ToastService);

  handleError(error: Error) {
    console.error('Error from global error handler', error);
    this.toastService.notifyError(error.message);
  }
}
