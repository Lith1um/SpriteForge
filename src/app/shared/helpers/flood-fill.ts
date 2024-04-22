import { Pixel } from "../../interfaces/pixel.interface";
import { Point2D } from "../models/point.interface";
import { pixelIndexToPoint2D, point2DToPixelIndex } from "./pixels";

// TODO: this is broken for some cases, investigate
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
    indexes.add(index);

    return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height
      && canvas.get(index)?.colour === clickedColour;
  }

  while (stack.length) {
    let index = stack.shift()!;

    points.push(pixelIndexToPoint2D(index, width));

    isValidSquare(index + 1) && stack.push(index + 1);
    isValidSquare(index - 1) && stack.push(index - 1);
    isValidSquare(index + width) && stack.push(index + width);
    isValidSquare(index - width) && stack.push(index - width);
  }

  return points;
};
