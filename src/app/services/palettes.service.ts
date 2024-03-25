import { Injectable, computed, inject } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Pixel } from '../interfaces/pixel.interface';
import { SavedModel, SavedModelJson } from '../interfaces/saved-model.model';

@Injectable({
  providedIn: 'root'
})
export class PalettesService {
  
  localStorageService = inject(LocalStorageService);
  
  private readonly recentlyUsedColoursKey = 'SpriteForgeRecentlyUsedColours';

  recentlyUsedSignal = this.localStorageService.listen<string[]>(this.recentlyUsedColoursKey);

  addRecentColor(colour?: string): void {
    if (!colour || colour === this.recentlyUsedSignal()?.[0]) {
      return;
    }
    this.localStorageService.updateItem<string[]>(this.recentlyUsedColoursKey, usedColors => ([
      colour,
      ...(usedColors ?? [])?.filter(usedColor => usedColor !== colour)
    ].slice(0, 25)));
  }

  removeRecentColour(colour: string): void {
    this.localStorageService.updateItem<string[]>(this.recentlyUsedColoursKey, usedColors => ([
      colour,
      ...(usedColors ?? [])?.filter(usedColor => usedColor !== colour)
    ]));
  }

}