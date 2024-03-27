import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  
  localStorageService = inject(LocalStorageService);
  
  private readonly darkModeKey = 'SpriteForgeDarkMode';

  darkModeSignal = this.localStorageService.listen<boolean>(this.darkModeKey);

  constructor() {
    const darkMode = this.localStorageService.getItem(this.darkModeKey);

    // set the dark mode key based on user preference if a setting is not present
    if (darkMode === null) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.localStorageService.setItem(this.darkModeKey, prefersDarkMode)
    }
  }

  toggleDarkMode(darkMode: boolean): void {
    this.localStorageService.setItem<boolean>(this.darkModeKey, darkMode);
  }

}