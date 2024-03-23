import { Point2D } from "../models/point.interface";

export const ellipse = (x1: number, x2: number, y1: number, y2: number): Point2D[] => {
  let a = Math.abs(x2 - x1) / 2;
    let b = Math.abs(y2 - y1) / 2;
    let xc = (x1 + x2) / 2;
    let yc = (y1 + y2) / 2;

    let x = 0;
    let y = b;
    let a2 = a * a;
    let b2 = b * b;
    let d = Math.round(b2 - (a2 * b) + (0.25 * a2));

    const points: Point2D[] = [];

    points.push(...ellipsePoints(xc, yc, x, y));

    while ((a2 * (y - 0.5)) > (b2 * (x + 1))) {
        if (d < 0) {
            d += b2 * (2 * x + 3);
        } else {
            d += (b2 * (2 * x + 3)) + (a2 * (-2 * y + 2));
            y--;
        }
        x++;
        points.push(...ellipsePoints(xc, yc, x, y));
    }

    d = Math.round((b2 * (x + 0.5) * (x + 0.5)) + (a2 * (y - 1) * (y - 1)) - (a2 * b2));

    while (y > 0) {
        if (d < 0) {
            d += b2 * (2 * x + 2) + (a2 * (-2 * y + 3));
            x++;
        } else {
            d += a2 * (-2 * y + 3);
        }
        y--;
        points.push(...ellipsePoints(xc, yc, x, y));
    }

    // Special handling for the case when the diameter is a multiple of 2
    if (a === b && x === a) {
      points.push(...ellipsePoints(xc, yc, x, 0));
    }

  return points;
}

function ellipsePoints(xc: number, yc: number, x: number, y: number): Point2D[] {
  return [
    {x: Math.round(xc + x), y: Math.round(yc + y)},
    {x: Math.round(xc - x), y: Math.round(yc + y)},
    {x: Math.round(xc + x), y: Math.round(yc - y)},
    {x: Math.round(xc - x), y: Math.round(yc - y)}
  ];
}

// export const ellipse = (x0: number, x1: number, y0: number, y1: number): Point2D[] => {
//     let xb, yb, xc, yc;

//     // Calculate height
//     yb = yc = (y0 + y1) / 2;
//     let qb = (y0 < y1) ? (y1 - y0) : (y0 - y1);
//     let qy = qb;
//     let dy = qb / 2;
//     if (qb % 2 != 0)
//         // Bounding box has even pixel height
//         yc++;

//     // Calculate width
//     xb = xc = (x0 + x1) / 2;
//     let qa = (x0 < x1) ? (x1 - x0) : (x0 - x1);
//     let qx = qa % 2;
//     let dx = 0;
//     let qt = qa*qa + qb*qb -2*qa*qa*qb;
//     if (qx != 0) {
//         // Bounding box has even pixel width
//         xc++;
//         qt += 3*qb*qb;
//     }

//     const points: Point2D[] = [];

//     // Start at (dx, dy) = (0, b) and iterate until (a, 0) is reached
//     while (qy >= 0 && qx <= qa) {
//         // Draw the new points
//         points.push({x: xb-dx, y: yb-dy});
//         if (dx != 0 || xb != xc) {
//           points.push({x: xc+dx, y: yb-dy});
//             if (dy != 0 || yb != yc) {
//               points.push({x: xc+dx, y: yc+dy});
//             }
//         }
//         if (dy != 0 || yb != yc) {
//           points.push({x: xb-dx, y: yc+dy});
//         }

//         // If a (+1, 0) step stays inside the ellipse, do it
//         if (qt + 2*qb*qb*qx + 3*qb*qb <= 0 || 
//             qt + 2*qa*qa*qy - qa*qa <= 0) {
//             qt += 8*qb*qb + 4*qb*qb*qx;
//             dx++;
//             qx += 2;
//         // If a (0, -1) step stays outside the ellipse, do it
//         } else if (qt - 2*qa*qa*qy + 3*qa*qa > 0) {
//             qt += 8*qa*qa - 4*qa*qa*qy;
//             dy--;
//             qy -= 2;
//         // Else step (+1, -1)
//         } else {
//             qt += 8*qb*qb + 4*qb*qb*qx + 8*qa*qa - 4*qa*qa*qy;
//             dx++;
//             qx += 2;
//             dy--;
//             qy -= 2;
//         }
//     }   // End of while loop
//     return points;
// }