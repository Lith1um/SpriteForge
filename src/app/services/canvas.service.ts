import { Injectable, effect } from '@angular/core';
import { canvasState } from '../state/canvas-state';
import { undoRedoState } from '../state/undo-redo-state';
import { bresenhamLine } from '../shared/helpers/bresenham-line';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  canvasState = canvasState({
    canvas: [],
    colour: '#FF0000',
    height: 0,
    painting: false,
    started: false,
    width: 0,
    filename: undefined,
    lastDrawnPixelIndex: undefined
  });

  undoRedoState = undoRedoState({
    undoBuffer: [],
    redoBuffer: []
  });

  initCanvas(width: number, height: number): void {
    this.canvasState.initCanvas(width, height);
  }

  updatePixel(pixelIndex: number): void {
    this.canvasState.updatePixel(pixelIndex);
    // TODO: fill any gaps between last drawn pixel and this one
    if (this.canvasState.lastDrawnPixelIndex() !== undefined) {
      this.fillLine(this.canvasState.lastDrawnPixelIndex() as number, pixelIndex);
    }

    this.canvasState.lastDrawnPixelIndex.set(pixelIndex);
  }

  startPainting(pixelIndex: number): void {
    this.undoRedoState.commit(this.canvasState.canvas());
    // TODO: store the start pixel to fill lines
    this.canvasState.lastDrawnPixelIndex.set(pixelIndex);
    this.canvasState.painting.set(true);
  }

  stopPainting(): void {
    // TODO: reset the start pixel
    this.canvasState.lastDrawnPixelIndex.set(undefined);
    this.canvasState.painting.set(false);
  }

  undo(): void {
    const pixels = this.undoRedoState.undo(this.canvasState.canvas());

    if (!pixels) {
      return;
    }
    this.canvasState.canvas.set(pixels);
  }

  redo(): void {
    const pixels = this.undoRedoState.redo(this.canvasState.canvas());

    if (!pixels) {
      return;
    }
    this.canvasState.canvas.set(pixels);
  }

  fillLine(startIndex: number, endIndex: number): void {
    let x0 = startIndex % this.canvasState.width();
    let y0 = Math.floor(startIndex / this.canvasState.width());

    let x1 = endIndex % this.canvasState.width();
    let y1 = Math.floor(endIndex / this.canvasState.width());

    const points = bresenhamLine(x0, x1, y0, y1);

    this.canvasState.updatePixels(points.map(point => point.y * this.canvasState.width() + point.x));
  }
}
