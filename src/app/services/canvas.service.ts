import { Injectable, effect } from '@angular/core';
import { canvasState } from '../state/canvas-state';
import { undoRedoState } from '../state/undo-redo-state';

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
    filename: undefined
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
  }

  startPainting(): void {
    this.undoRedoState.commit(this.canvasState.canvas());
    this.canvasState.painting.set(true);
  }

  stopPainting(): void {
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

}
