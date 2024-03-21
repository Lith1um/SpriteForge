import { Injectable, inject } from '@angular/core';
import { canvasState } from '../state/canvas-state';
import { bresenhamLine } from '../shared/helpers/bresenham-line';
import { pixelIndexToPoint2D, point2DToPixelIndex } from '../shared/helpers/pixels';
import { SaveLoadService } from './save-load.service';
import { CanvasTool } from '../interfaces/canvas-state.interface';
import { toolService } from './tool.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  saveLoadService = inject(SaveLoadService);

  state = canvasState({
    canvas: new Map(),
    colour: '#FF0000',
    height: 0,
    painting: false,
    started: false,
    width: 0,
    filename: undefined,
    undoBuffer: [],
    redoBuffer: [],
    tool: CanvasTool.Draw
  });

  toolService = toolService(this.state);

  initCanvas(width: number, height: number): void {
    this.state.initCanvas(width, height);
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
