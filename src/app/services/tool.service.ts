import { CanvasTool } from "../interfaces/canvas-state.interface";
import { objectSignal } from "../shared/state/object-signal-state";
import { Point2D } from "../shared/models/point.interface";
import { point2DToPixelIndex } from "../shared/helpers/pixels";
import { Pixel } from "../interfaces/pixel.interface";
import { bresenhamLine } from "../shared/helpers/bresenham-line";
import { CanvasStateSignal } from "../state/canvas-state";
import { floodFill } from "../shared/helpers/flood-fill";
import { rectangle } from "../shared/helpers/rectangle";
import { ellipse } from "../shared/helpers/ellipse";

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

  const draw = (pixel: Point2D): void => {
    const lastDrawnPixel = state.lastDrawnPixel();

    if (lastDrawnPixel) {
      const indexes = bresenhamLine(lastDrawnPixel.x, pixel.x, lastDrawnPixel.y, pixel.y)
        .map(point => point2DToPixelIndex(point, canvasState.width()))
      canvasState.updatePixels(indexes);
    } else {
      canvasState.updatePixel(point2DToPixelIndex(pixel, canvasState.width()));
    }
    state.lastDrawnPixel.set(pixel);
  }

  const drawLine = (pixel: Point2D): void => {
    const start = state.startPixel();
    const canvas = state.startingCanvas();

    if (!start || !canvas) {
      return;
    }
    const lineIndexes = bresenhamLine(start.x, pixel.x, start.y, pixel.y)
      .map(point => point2DToPixelIndex(point, canvasState.width()));

    canvasState.updateCanvas(lineIndexes, canvas);
  };

  const fill = (pixel: Point2D): void => {
    const start = state.startPixel();
    const canvas = state.startingCanvas();

    if (!start || !canvas) {
      return;
    }
    const currentPixel = canvasState.canvas().get(point2DToPixelIndex(pixel, canvasState.width()));

    const fillIndexes = floodFill(
      start.x,
      start.y,
      canvasState.width(),
      canvasState.height(),
      canvasState.canvas(),
      currentPixel?.colour ?? null
    ).map(point => point2DToPixelIndex(point, canvasState.width()));

    canvasState.updatePixels(fillIndexes);
  };

  const drawRectangle = (pixel: Point2D): void => {
    const start = state.startPixel();
    const canvas = state.startingCanvas();

    if (!start || !canvas) {
      return;
    }
    const rectangleIndexes = rectangle(start.x, pixel.x, start.y, pixel.y)
      .map(point => point2DToPixelIndex(point, canvasState.width()));

    canvasState.updateCanvas(rectangleIndexes, canvas);
  };

  const drawCircle = (pixel: Point2D): void => {
    const start = state.startPixel();
    const canvas = state.startingCanvas();

    if (!start || !canvas) {
      return;
    }

    const circleIndexes = ellipse(start.x, pixel.x, start.y, pixel.y)
      .map(point => point2DToPixelIndex(point, canvasState.width()));

    canvasState.updateCanvas(Array.from(new Set(circleIndexes)), canvas);
  };

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
          draw(pixel);
          break;

        case CanvasTool.Line:
          drawLine(pixel);
          break;

        case CanvasTool.Fill:
          fill(pixel);
          break;

        case CanvasTool.Rectangle:
          drawRectangle(pixel);
          break;

        case CanvasTool.Circle:
          drawCircle(pixel);
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