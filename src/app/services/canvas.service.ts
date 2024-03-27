import { Injectable, computed, inject } from '@angular/core';
import { canvasState } from '../state/canvas-state';
import { pixelIndexToPoint2D } from '../shared/helpers/pixels';
import { SaveLoadService } from './save-load.service';
import { toolService } from './tool.service';
import { SavedModel } from '../interfaces/saved-model.model';
import { PalettesService } from './palettes.service';
import { Point2D } from '../shared/models/point.interface';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  saveLoadService = inject(SaveLoadService);
  palettesService = inject(PalettesService);

  state = canvasState();

  toolService = toolService(this.state);

  mirrorXY = computed(() => this.state.mirrorHorizontal() && this.state.mirrorVertical());

  initCanvas(width: number, height: number): void {
    this.state.initCanvas(width, height);
  }

  clearCanvas(): void {
    this.state.commit();
    this.state.clearCanvas();
  }

  startPainting(pixelIndex: number): void {
    this.state.commit();
    this.palettesService.addRecentColor(this.state.colour());

    const pixelPoints = this.pointsForPaint(pixelIndex);

    this.toolService.start(pixelPoints, this.state.canvas());
    this.toolService.paint(pixelPoints);
    this.state.painting.set(true);
  }

  paint(pixelIndex: number): void {
    if (!this.state.painting()) {
      return;
    }

    const pixelPoints = this.pointsForPaint(pixelIndex);
    this.toolService.paint(pixelPoints);
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

  load(model: SavedModel, isImport: boolean = false): void {
    this.state.load(model, isImport);
  }

  private pointsForPaint(pixelIndex: number): Point2D[] {
    const pixelPoint = pixelIndexToPoint2D(pixelIndex, this.state.width());
    const pixelPoints = [pixelPoint];

    if (this.state.mirrorVertical()) {
      // mirror the actions
      pixelPoints.push({
        x: this.state.width() - 1 - pixelPoint.x,
        y: pixelPoint.y
      });
    }
    if (this.state.mirrorHorizontal()) {
      // mirror the actions
      pixelPoints.push({
        x: pixelPoint.x,
        y: this.state.height() - 1 - pixelPoint.y
      });
    }
    if (this.mirrorXY()) {
      // mirror the actions
      pixelPoints.push({
        x: this.state.width() - 1 - pixelPoint.x,
        y: this.state.height() - 1 - pixelPoint.y
      });
    }
    return pixelPoints;
  } 
}
