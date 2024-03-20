export const bresenhamLine = (x0: number, x1: number, y0: number, y1: number): { x: number; y: number }[] => {
  const points = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const sy = Math.sign(y1 - y0);
  let err = dx - dy;

  while (true) {
    // start filling the line
    // TODO: potentially find a way to collect all pixels to be drawn and send as one request
    points.push({x: x0, y: y0});

    if (x0 === x1 && y0 === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 <  dx) { err += dx; y0 += sy; }
  }

  return points;
};
