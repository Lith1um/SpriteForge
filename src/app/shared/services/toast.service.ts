import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  notifyError(message: string, duration: number = 4000): void {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant: 'danger',
      closable: true,
      duration,
      innerHTML: `
        <sl-icon name="exclamation-octagon" slot="icon"></sl-icon>
        ${message}
      `
    });

    document.body.append(alert);
    alert.toast();
  }

}