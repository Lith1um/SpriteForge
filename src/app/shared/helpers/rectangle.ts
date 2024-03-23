import { Point2D } from "../models/point.interface";

export const rectangle = (x0: number, x1: number, y0: number, y1: number): Point2D[] => {
  // We first find the limits
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);

  const results: Point2D[] = [];
  // With this double nested for loop we find all the solutions are included in the limits
  for (let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if (x === minX || x === maxX || y === minY || y === maxY) {
        results.push({ x, y });
      }
    }
  }
  return results;
};
