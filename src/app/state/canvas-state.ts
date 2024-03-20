import { CanvasState } from "../shared/models/canvas-state.interface";
import { objectSignal } from "../shared/state/object-signal-state";

export const canvasState = (initialState: CanvasState) => {

  const state = objectSignal<CanvasState>(initialState);

  const methods = {
    initCanvas: (width: number, height: number): void => state.update(currState => ({
      ...currState,
      width,
      height,
      canvas: new Array(width * height).fill(undefined)
        .map((pixel, index) => ({ index, colour: undefined })),
      started: true
    })),

    updatePixel: (pixelIndex: number): void => {
      const newCanvas = state.canvas().map(pixel => {
        if (pixelIndex === pixel.index) {
          return {
            index: pixel.index,
            colour: state().colour
          };
        }
        return pixel;
      });
  
      state.canvas.set(newCanvas);
    }
  };
  
  return Object.assign(state, methods);
}