import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './app/shared/services/global-error-handler.service';
import { setBasePath } from '@shoelace-style/shoelace';

setBasePath('/shoelace/');
import '@shoelace-style/shoelace/dist/shoelace.js'

bootstrapApplication(AppComponent, {
  providers: [
    // { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
}).catch((err) => console.error(err));
