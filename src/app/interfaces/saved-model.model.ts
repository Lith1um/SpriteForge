import { Pixel } from "./pixel.interface";

export interface SavedModelJson {
  filename: string;
  canvas: [number, Pixel][];
  frames?: [number, Pixel][][];
  width: number;
  height: number;
  timestamp: number;
}

export class SavedModel {

  static fromJson(json: SavedModelJson): SavedModel {
    return {
      filename: json.filename,
      width: json.width,
      height: json.height,
      canvas: new Map(json.canvas),
      frames: json.frames?.map(frame => new Map(frame)) ?? [],
      timestamp: json.timestamp
    }
  }

  constructor(
    readonly filename: string,
    readonly canvas: Map<number, Pixel>,
    readonly frames: Map<number, Pixel>[],
    readonly width: number,
    readonly height: number,
    readonly timestamp: number,
  ) {}

}