import { Injectable } from '@angular/core';
import { canvasState } from '../shared/state/canvas-state';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  state = canvasState({
    canvas: [],
    colour: '#FFFFFF',
    height: 0,
    painting: false,
    started: false,
    width: 0
  });

  initCanvas(width: number, height: number): void {
    this.state.initCanvas(width, height);
  }

  updatePixel(pixelIndex: number): void {
    this.state.updatePixel(pixelIndex);
  }

  togglePainting(painting: boolean): void {
    this.state.updatePainting(painting);
  }

}
