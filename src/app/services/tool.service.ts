import { CanvasTool } from "../interfaces/canvas-state.interface";
import { objectSignal } from "../shared/state/object-signal-state";
import { Point2D } from "../shared/models/point.interface";
import { point2DToPixelIndex } from "../shared/helpers/pixels";
import { Pixel } from "../interfaces/pixel.interface";
import { bresenhamLine } from "../shared/helpers/bresenham-line";
import { CanvasStateSignal } from "../state/canvas-state";
import { floodFill } from "../shared/helpers/flood-fill";

export const toolService = (canvasState: CanvasStateSignal) => {

  // bit of state to manage start point for paint
  const state = objectSignal<{
    startPixel: Point2D | undefined;
    lastDrawnPixel: Point2D | undefined;
    startingCanvas: Map<number, Pixel> | undefined;
  }>({
    startPixel: undefined,
    lastDrawnPixel: undefined,
    startingCanvas: undefined,
  });

  const drawLine = (startPoint: Point2D, endPoint: Point2D): number[] => {
    return bresenhamLine(startPoint.x, endPoint.x, startPoint.y, endPoint.y)
      .map(point => point2DToPixelIndex(point, canvasState.width()));
  }

  const fill = (startPoint: Point2D, clickedColour: string | null): number[] => {
    return floodFill(startPoint.x, startPoint.y, canvasState.width(), canvasState.height(), canvasState.canvas(), clickedColour)
      .map(point => point2DToPixelIndex(point, canvasState.width()));
  }

  return {
    start: (pixel: Point2D, canvas: Map<number, Pixel>) => {
      state.set({
        startPixel: pixel,
        startingCanvas: canvas,
        lastDrawnPixel: canvasState.tool() === CanvasTool.Draw
          ? pixel
          : undefined,
      });
    },

    paint: (pixel: Point2D): void => {
      switch (canvasState.tool()) {
        case CanvasTool.Draw:
          if (state.lastDrawnPixel()) {
            canvasState.updatePixels(drawLine(state.lastDrawnPixel() as Point2D, pixel));
          } else {
            canvasState.updatePixel(point2DToPixelIndex(pixel, canvasState.width()));
          }
          state.lastDrawnPixel.set(pixel);
          break;
        case CanvasTool.Line:
          if (!state.startPixel() || !state.startingCanvas()) {
            return;
          }
          const lineIndexes = drawLine(state.startPixel() as Point2D, pixel);
          canvasState.updateCanvas(lineIndexes, state.startingCanvas() as Map<number, Pixel>);
          break;
        case CanvasTool.Fill:
          if (!state.startPixel() || !state.startingCanvas()) {
            return;
          }
          const currentPixel = canvasState.canvas().get(point2DToPixelIndex(pixel, canvasState.width()));

          const fillIndexes = fill(state.startPixel() as Point2D, currentPixel?.colour ?? null);
          canvasState.updatePixels(fillIndexes);
          break;
      }
    },

    end: () => {
      state.set({
        startPixel: undefined,
        startingCanvas: undefined,
        lastDrawnPixel: undefined,
      });
    }
  }
};