import { CanvasState } from "../../interfaces/canvas-state.interface";
import { Pixel } from "../../interfaces/pixel.interface";
import { Point2D } from "../models/point.interface";
import { pixelIndexToPoint2D, point2DToPixelIndex } from "./pixels";

export const floodFill = (
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: Map<number, Pixel>,
  clickedColour: string | null
): Point2D[] => {
  const points: Point2D[] = [];
  const stack = [point2DToPixelIndex({x, y}, width)];
  const indexes: Set<number> = new Set();

  const isValidSquare = (index: number): boolean => {
    let point = pixelIndexToPoint2D(index, width);

    if (indexes.has(index)) {
      return false;
    }
    return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height
      && canvas.get(index)?.colour === clickedColour;
  }

  while (stack.length) {
    let index = stack.pop()!;
    let point = pixelIndexToPoint2D(index, width)

    points.push(point);
    indexes.add(index);

    isValidSquare(index + 1) && stack.push(index + 1);
    isValidSquare(index - 1) && stack.push(index - 1);
    isValidSquare(index + width) && stack.push(index + width);
    isValidSquare(index - width) && stack.push(index - width);
  }

  return points;
};
