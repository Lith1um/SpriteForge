import { Injectable, inject } from '@angular/core';
import { canvasState } from '../state/canvas-state';
import { bresenhamLine } from '../shared/helpers/bresenham-line';
import { pixelIndexToPoint2D, point2DToPixelIndex } from '../shared/helpers/pixels';
import { SaveLoadService } from './save-load.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  saveLoadService = inject(SaveLoadService);

  state = canvasState({
    canvas: [],
    colour: '#FF0000',
    height: 0,
    painting: false,
    started: false,
    width: 0,
    filename: undefined,
    lastDrawnPixelIndex: undefined,
    undoBuffer: [],
    redoBuffer: [],
  });

  initCanvas(width: number, height: number): void {
    this.state.initCanvas(width, height);
  } 

  updatePixel(pixelIndex: number): void {
    this.state.updatePixel(pixelIndex);
    if (this.state.lastDrawnPixelIndex() !== undefined) {
      this.fillLine(this.state.lastDrawnPixelIndex() as number, pixelIndex);
    }
    this.state.lastDrawnPixelIndex.set(pixelIndex);
  }

  startPainting(pixelIndex: number): void {
    this.state.commit();
    this.state.lastDrawnPixelIndex.set(pixelIndex);
    this.state.painting.set(true);
  }

  stopPainting(): void {
    this.state.lastDrawnPixelIndex.set(undefined);
    this.state.painting.set(false);
  }

  undo(): void {
    this.state.undo();
  }

  redo(): void {
    this.state.redo();
  }

  fillLine(startIndex: number, endIndex: number): void {
    const startPoint = pixelIndexToPoint2D(startIndex, this.state.width());
    const endPoint = pixelIndexToPoint2D(endIndex, this.state.width());

    const points = bresenhamLine(startPoint.x, endPoint.x, startPoint.y, endPoint.y);

    this.state.updatePixels(points.map(point => point2DToPixelIndex(point, this.state.width())));
  }

  save(filename: string): void {
    this.saveLoadService.save(filename, this.state.canvas());
  }
}
