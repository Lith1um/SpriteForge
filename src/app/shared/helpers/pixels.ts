import { Point2D } from "../models/point.interface";

export const pixelIndexToPoint2D = (pixelIndex: number, width: number): Point2D => ({
  x: pixelIndex % width,
  y: Math.floor(pixelIndex / width)
});

export const point2DToPixelIndex = (point: Point2D, width: number): number =>
  point.y * width + point.x;