import { Injectable, inject } from '@angular/core';
import { canvasState } from '../state/canvas-state';
import { pixelIndexToPoint2D } from '../shared/helpers/pixels';
import { SaveLoadService } from './save-load.service';
import { CanvasTool } from '../interfaces/canvas-state.interface';
import { toolService } from './tool.service';
import { SavedModel } from '../interfaces/saved-model.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  saveLoadService = inject(SaveLoadService);

  state = canvasState();

  toolService = toolService(this.state);

  initCanvas(width: number, height: number): void {
    this.state.initCanvas(width, height);
  }

  clearCanvas(): void {
    this.state.commit();
    this.state.clearCanvas();
  }

  startPainting(pixelIndex: number): void {
    this.state.commit();
    const pixelPoint = pixelIndexToPoint2D(pixelIndex, this.state.width())
    this.toolService.start(pixelPoint, this.state.canvas());
    this.toolService.paint(pixelPoint);
    this.state.painting.set(true);
  }

  paint(pixelIndex: number): void {
    if (!this.state.painting()) {
      return;
    }
    this.toolService.paint(pixelIndexToPoint2D(pixelIndex, this.state.width()));
  }

  stopPainting(): void {
    this.state.painting.set(false);
    this.toolService.end();
  }

  undo(): void {
    this.state.undo();
  }

  redo(): void {
    this.state.redo();
  }

  save(): void {
    this.saveLoadService.save(this.state.filename(), this.state.canvas());
  }

  saveAs(filename: string): void {
    this.saveLoadService.saveAs(filename, this.state.canvas(), this.state.width(), this.state.height());
    this.state.filename.set(filename);
  }

  load(model: SavedModel): void {
    this.state.load(model);
  }
}
