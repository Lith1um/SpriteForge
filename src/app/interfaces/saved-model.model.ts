import { Pixel } from "./pixel.interface";

export interface SavedModelJson {
  filename: string;
  canvas: [number, Pixel][];
  width: number;
  height: number;
}

export class SavedModel {

  static fromJson(json: SavedModelJson): SavedModel {
    return {
      filename: json.filename,
      width: json.width,
      height: json.height,
      canvas: new Map(json.canvas)
    }
  }

  constructor(
    readonly filename: string,
    readonly canvas: Map<number, Pixel>,
    readonly width: number,
    readonly height: number
  ) {}

}