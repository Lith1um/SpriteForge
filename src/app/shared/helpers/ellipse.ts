import { Point2D } from "../models/point.interface";

export const ellipse = (x0: number, x1: number, y0: number, y1: number): Point2D[] => {
  let a = Math.abs(x1 - x0);
  let b = Math.abs(y1 - y0);
  let b1 = b & 1; /* values of diameter */
  let dx = 4 * (1 - a) * b * b;
  let dy = 4 * (b1 + 1) * a * a;
  let err = dx + dy + b1 * a * a;
  let e2;

  if (x0 > x1) {
    x0 = x1;
    x1 += a;
  }
  if (y0 > y1) y0 = y1;
  y0 += (b + 1) / 2;
  y1 = y0 - b1;
  a *= 8 * a;
  b1 = 8 * b * b;

  const points: Point2D[] = [];

  do {
    points.push({ x: Math.floor(x1), y: Math.floor(y0) }); /*   I. Quadrant */
    points.push({ x: Math.floor(x0), y: Math.floor(y0) }); /*  II. Quadrant */
    points.push({ x: Math.floor(x0), y: Math.floor(y1) }); /* III. Quadrant */
    points.push({ x: Math.floor(x1), y: Math.floor(y1) }); /*  IV. Quadrant */
    e2 = 2 * err;
    if (e2 <= dy) {
      y0++;
      y1--;
      err += dy += a;
    } /* y step */
    if (e2 >= dx || 2 * err > dy) {
      x0++;
      x1--;
      err += dx += b1;
    } /* x step */
  } while (x0 <= x1);

  while (y0 - y1 < b) { /* too early stop of flat ellipses a=1 */
    points.push({ x: Math.floor(x0 - 1), y: Math.floor(y0) }); /* -> finish tip of ellipse */
    points.push({ x: Math.floor(x1 + 1), y: Math.floor(y0++) });
    points.push({ x: Math.floor(x0 - 1), y: Math.floor(y1) });
    points.push({ x: Math.floor(x1 + 1), y: Math.floor(y1--) });
  }
  return points;
}
