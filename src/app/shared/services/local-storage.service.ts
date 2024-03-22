import { Injectable, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  storageSignal = toSignal(fromEvent<StorageEvent>(window, 'storage'));

  listen<T>(key: string): Signal<T | null | undefined> {
    return computed<T | undefined>(() => {
      const storageEvent = this.storageSignal();

      // try to cover initial case with no storage event
      if (!storageEvent) {
        return this.getItem<T>(key);
      }

      if (storageEvent?.key === key) {
        return storageEvent.newValue
          ? JSON.parse(storageEvent.newValue)
          : storageEvent.newValue
      }
    });
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));

    const event = new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(value)
    });
    
    dispatchEvent(event);
  }

  updateItem<T>(key: string, callback: (currValue: T | null) => T): void {
    const currValue = this.getItem<T>(key);
    this.setItem(key, callback(currValue));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
}