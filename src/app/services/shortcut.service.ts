import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {

  enabled: Signal<boolean>;

  private enabledSignal = signal<boolean>(true);

  constructor() {
    this.enabled = this.enabledSignal.asReadonly();
  }

  enable(): void {
    this.enabledSignal.set(true);
  }
  
  disable(): void {
    this.enabledSignal.set(false);
  }

}