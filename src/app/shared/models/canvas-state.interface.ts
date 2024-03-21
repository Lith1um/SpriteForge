import { Pixel } from "../../interfaces/pixel.interface";

export interface CanvasState {

  canvas: Pixel[];
  colour: string;
  height: number;
  painting: boolean;
  started: boolean;
  width: number;
  filename: string | undefined;
  lastDrawnPixelIndex: number | undefined;
  undoBuffer: Pixel[][];
  redoBuffer: Pixel[][];

}
