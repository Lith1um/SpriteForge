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

  const inBounds = (point: Point2D) => point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;

  const isValidSquare = (index: number): boolean => {
    if (indexes.has(index) || index < 0) {
      return false;
    }
    indexes.add(index);

    return canvas.get(index)?.colour === clickedColour;
  }

  while (stack.length) {
    let index = stack.shift()!;

    const point = pixelIndexToPoint2D(index, width);
    points.push(point);

    inBounds({x: point.x + 1, y: point.y}) && isValidSquare(index + 1) && stack.push(index + 1);
    inBounds({x: point.x - 1, y: point.y}) && isValidSquare(index - 1) && stack.push(index - 1);
    inBounds({x: point.x, y: point.y + 1}) && isValidSquare(index + width) && stack.push(index + width);
    inBounds({x: point.x, y: point.y - 1}) && isValidSquare(index - width) && stack.push(index - width);
  }

  return points;
};
