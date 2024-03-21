import { Injectable, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  listen<T>(key: string): Signal<T | null | undefined> {
    return toSignal<T | null>(fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event) => event?.key === key),
        map((event: StorageEvent) => event.newValue
          ? JSON.parse(event.newValue)
          : event.newValue
        )
      ));
  }

  getItem<T, S = unknown>(key: string, reviver?: (key: string, value: S) => T): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item, reviver) : null;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  updateItem<T>(key: string, callback: (currValue: T | null) => T): void {
    const currValue = this.getItem<T>(key);
    this.setItem(key, callback(currValue));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
}