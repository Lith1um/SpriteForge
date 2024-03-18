import { Injectable, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  listen(key: string): Signal<string | null | undefined> {
    return toSignal<string | null>(fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event) => event?.key === key),
        map((event: StorageEvent) => event.newValue)
      ));
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
}