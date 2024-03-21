import { CanvasState } from "../../interfaces/canvas-state.interface";
import { Point2D } from "../models/point.interface";
import { point2DToPixelIndex } from "./pixels";

export const floodFill = (
  x: number,
  y: number,
  canvasState: CanvasState,
  clickedColour: string | null
): Point2D[] => {
  const points: Point2D[] = [];
  const indexes: Set<number> = new Set();

  const isValidSquare = (xPos: number, yPos: number, index: number) => {
    return xPos >= 0 && xPos < canvasState.width && yPos >= 0 && yPos < canvasState.height
      && canvasState.canvas[index].colour === clickedColour;
  }

  const fill = (xPos: number, yPos: number) => {
    const index = point2DToPixelIndex({x: xPos, y: yPos}, canvasState.width);

    if (indexes.has(index)) {
      return;
    }

    if (isValidSquare(xPos, yPos, index)) {
      points.push({ x: xPos, y: yPos });
      indexes.add(index);
      fill(xPos + 1, yPos);
      fill(xPos - 1, yPos);
      fill(xPos, yPos + 1);
      fill(xPos, yPos - 1); 
    }
  }
  fill(x, y);

  return points;
};
