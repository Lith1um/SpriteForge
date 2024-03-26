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
    startPixels: Point2D[] | undefined;
    lastDrawnPixels: Point2D[] | undefined;
    startingCanvas: Map<number, Pixel> | undefined;
  }>({
    startPixels: undefined,
    lastDrawnPixels: undefined,
    startingCanvas: undefined,
  });

  const draw = (pixels: Point2D[], erase: boolean = false): void => {
    const lastDrawnPixels = state.lastDrawnPixels();

    if (lastDrawnPixels && lastDrawnPixels.length >= pixels.length) {
      // possible bug when changing mirror values
      const indexes = pixels.flatMap((pixel, index) => {
        return bresenhamLine(lastDrawnPixels[index].x, pixel.x, lastDrawnPixels[index].y, pixel.y)
          .map(point => point2DToPixelIndex(point, canvasState.width()))
        });
        canvasState.updatePixels(indexes, erase);
    } else {
      canvasState.updatePixels(
        pixels.map(pixel => point2DToPixelIndex(pixel, canvasState.width())),
        erase
      );
    }
    state.lastDrawnPixels.set(pixels);
  }

  const drawLine = (pixels: Point2D[]): void => {
    const startPixels = state.startPixels();
    const canvas = state.startingCanvas();

    if (!startPixels || !canvas) {
      return;
    }
    const lineIndexes = pixels.flatMap((pixel, index) =>
      bresenhamLine(startPixels[index].x, pixel.x, startPixels[index].y, pixel.y)
        .map(point => point2DToPixelIndex(point, canvasState.width()))
    );

    canvasState.updateCanvas(Array.from(new Set(lineIndexes)), canvas);
  };

  const fill = (pixels: Point2D[]): void => {
    const startPixels = state.startPixels();
    const canvas = state.startingCanvas();

    if (!startPixels || !canvas) {
      return;
    }
    const currentPixel = canvasState.canvas().get(point2DToPixelIndex(pixels[0], canvasState.width()));


    const fillIndexes = pixels.flatMap(pixel => floodFill(
      pixel.x,
      pixel.y,
      canvasState.width(),
      canvasState.height(),
      canvasState.canvas(),
      currentPixel?.colour ?? null
    ).map(point => point2DToPixelIndex(point, canvasState.width())));

    canvasState.updatePixels(fillIndexes);
  };

  const drawRectangle = (pixels: Point2D[]): void => {
    const startPixels = state.startPixels();
    const canvas = state.startingCanvas();

    if (!startPixels || !canvas) {
      return;
    }
    const rectangleIndexes = pixels.flatMap((pixel, index) => rectangle(startPixels[index].x, pixel.x, startPixels[index].y, pixel.y)
      .map(point => point2DToPixelIndex(point, canvasState.width())));

    canvasState.updateCanvas(Array.from(new Set(rectangleIndexes)), canvas);
  };

  const drawCircle = (pixels: Point2D[]): void => {
    const startPixels = state.startPixels();
    const canvas = state.startingCanvas();

    if (!startPixels || !canvas) {
      return;
    }

    const circleIndexes = pixels.flatMap((pixel, index) => ellipse(startPixels[index].x, pixel.x, startPixels[index].y, pixel.y)
      .map(point => point2DToPixelIndex(point, canvasState.width())));

    canvasState.updateCanvas(Array.from(new Set(circleIndexes)), canvas);
  };

  return {
    start: (pixels: Point2D[], canvas: Map<number, Pixel>) => {
      state.set({
        // TODO: make into array
        startPixels: pixels,
        startingCanvas: canvas,
        lastDrawnPixels: canvasState.tool() === CanvasTool.Draw
          ? pixels
          : undefined,
      });
    },

    paint: (pixels: Point2D[]): void => {
      switch (canvasState.tool()) {
        case CanvasTool.Draw:
          draw(pixels);
          break;

        case CanvasTool.Line:
          drawLine(pixels);
          break;

        case CanvasTool.Erase:
          draw(pixels, true);
          break;

        case CanvasTool.Fill:
          fill(pixels);
          break;

        case CanvasTool.Rectangle:
          drawRectangle(pixels);
          break;

        case CanvasTool.Circle:
          drawCircle(pixels);
          break;
      }
    },

    end: () => {
      state.set({
        startPixels: undefined,
        startingCanvas: undefined,
        lastDrawnPixels: undefined,
      });
    }
  }
};