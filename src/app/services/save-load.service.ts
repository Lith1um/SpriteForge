import { Injectable, computed, inject } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Pixel } from '../interfaces/pixel.interface';
import { SavedModel, SavedModelJson } from '../interfaces/saved-model.model';
import { ToastService } from '../shared/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class SaveLoadService {

  private readonly savedModelsKey = 'SpriteForgeSaves';

  localStorageService = inject(LocalStorageService);
  toastService = inject(ToastService);

  savedModelsJsonSignal = this.localStorageService.listen<{[key: string]: SavedModelJson}>(this.savedModelsKey);
  savedModelsSignal = computed(() => {
    const modelsJson = this.savedModelsJsonSignal();

    if (!modelsJson) {
      return undefined;
    }
    return Object.keys(modelsJson).map(filename => SavedModel.fromJson(modelsJson[filename]));
  });

  save(filename: string | undefined, canvas: Map<number, Pixel>, frames: Map<number, Pixel>[]): void {
    if (!filename) {
      throw new Error(`SaveLoadService::save(): Filename is not set, cannot save`);
    }

    this.localStorageService.updateItem<{[key: string]: SavedModelJson}>(this.savedModelsKey, (currSavedModels) => {
      if (!currSavedModels?.[filename]) {
        throw new Error(`SaveLoadService::save(): File with name ${filename} does not exist`);
      }

      const savedModels = { ...currSavedModels };
      savedModels[filename] = {
        filename,
        canvas: Array.from(canvas.entries()),
        frames: frames.map(frame => Array.from(frame.entries())),
        width: savedModels[filename].width,
        height: savedModels[filename].height,
        timestamp: Date.now()
      };
      return savedModels;
    });

    this.fileSavedToast(filename);
  }

  saveAs(filename: string, canvas: Map<number, Pixel>, frames: Map<number, Pixel>[], width: number, height: number): void {
    this.localStorageService.updateItem<{[key: string]: SavedModelJson}>(this.savedModelsKey, (currSavedModels) => {
      if (currSavedModels?.[filename]) {
        throw new Error(`SaveLoadService::saveAs(): File with name ${filename} already exists`);
      }

      const savedModels = { ...currSavedModels };
      savedModels[filename] = {
        filename,
        canvas: Array.from(canvas.entries()),
        frames: frames.map(frame => Array.from(frame.entries())),
        width,
        height,
        timestamp: Date.now()
      };
      return savedModels;
    });

    this.fileSavedToast(filename);
  }

  load(filename: string): SavedModel {
    const savedModelJson = this.localStorageService.getItem<{[key: string]: SavedModelJson}>(this.savedModelsKey)?.[filename];

    if (!savedModelJson) {
      throw new Error(`SaveLoadService::load(): Could not find model with name ${filename}`);
    }
    return SavedModel.fromJson(savedModelJson);
  }

  delete(filename: string): void {
    this.localStorageService.updateItem<{[key: string]: SavedModelJson}>(this.savedModelsKey, (currSavedModels) => {
      if (!currSavedModels?.[filename]) {
        throw new Error(`SaveLoadService::delete(): File with name ${filename} could not be found for deletion`);
      }

      // @ts-ignore
      const { [filename]: model, ...savedModels } = currSavedModels;

      return savedModels;
    });
  }

  fileSavedToast(filename: string): void {
    this.toastService.notifySuccess(`File "${filename}" has been saved!`, 'floppy');
  }

}