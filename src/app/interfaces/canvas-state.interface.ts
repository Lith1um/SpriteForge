import { Pixel } from "./pixel.interface";

export enum CanvasTool {
  Draw = 'draw',
  Line = 'line',
  Fill = 'fill',
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
  tool: CanvasTool

}
