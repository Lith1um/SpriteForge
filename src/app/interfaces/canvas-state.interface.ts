import { Pixel } from "./pixel.interface";

export enum CanvasTool {
  Draw = 'draw',
  Line = 'line',
  Erase = 'erase',
  Fill = 'fill',
  Rectangle = 'rectangle',
  Circle = 'circle',
}

export interface CanvasState {

  canvas: Map<number, Pixel>;
  colour: string;
  height: number;
  painting: boolean;
  started: boolean;
  width: number;
  filename: string | undefined;
  undoBuffer: Map<number, Pixel>[];
  redoBuffer: Map<number, Pixel>[];
  tool: CanvasTool;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;

}
