import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Pixel } from '../interfaces/pixel.interface';
import { SavedModels } from '../interfaces/saved-models.interface';

@Injectable({
  providedIn: 'root'
})
export class SaveLoadService {

  private readonly savedModelsKey = 'SpriteForgeSaves';

  localStorageService = inject(LocalStorageService);

  save(fileName: string, canvas: Pixel[]): void {
    this.localStorageService.updateItem<SavedModels>(this.savedModelsKey, (currSavedModels) => {
      const savedModels = currSavedModels ?? {};
      savedModels[fileName] = canvas;
      return savedModels;
    });
  }

}