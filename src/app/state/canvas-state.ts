import { Pixel } from "../interfaces/pixel.interface";
import { CanvasState } from "../shared/models/canvas-state.interface";
import { objectSignal } from "../shared/state/object-signal-state";

export const canvasState = (initialState: CanvasState) => {

  const state = objectSignal<CanvasState>(initialState);

  const methods = {
    initCanvas: (width: number, height: number): void => state.update({
      ...state(),
      width,
      height,
      canvas: new Array(width * height).fill(undefined)
        .map((pixel, index) => ({ index, colour: undefined })),
      started: true
    }),
    updatePixel: (pixelIndex: number): void => {
      const newCanvas = state().canvas.map(pixel => {
        if (pixelIndex === pixel.index) {
          return {
            index: pixel.index,
            colour: state().colour
          };
        }
        return pixel;
      });
  
      state.update({
        ...state(),
        canvas: newCanvas
      });
    },
    updateCanvas: (canvas: Pixel[]): void => state.update({...state(), canvas}),
    updateColour: (colour: string): void => state.update({...state(), colour}),
    updateHeight: (height: number): void => state.update({...state(), height}),
    updatePainting: (painting: boolean): void => state.update({...state(), painting}),
    updateStarted: (started: boolean): void => state.update({...state(), started}),
    updateWidth: (width: number): void => state.update({...state(), width}),
  };
  
  return Object.assign(state, methods);
}