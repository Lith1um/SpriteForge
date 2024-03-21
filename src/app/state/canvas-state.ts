import { CanvasState } from "../shared/models/canvas-state.interface";
import { objectSignal } from "../shared/state/object-signal-state";

export const canvasState = (initialState: CanvasState) => {

  const state = objectSignal<CanvasState>(initialState);

  const bufferSize = 50;

  const methods = {
    initCanvas: (width: number, height: number): void => state.update(currState => ({
      ...currState,
      width,
      height,
      canvas: new Array(width * height).fill(undefined)
        .map((pixel, index) => ({ index, colour: null })),
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
    },

    updatePixels: (pixelIndexes: number[]): void => {
      const newCanvas = state.canvas().map(pixel => {
        if (pixelIndexes.includes(pixel.index)) {
          return {
            index: pixel.index,
            colour: state().colour
          };
        }
        return pixel;
      });
  
      state.canvas.set(newCanvas);
    },

    commit: (): void => {
      const undoBuffer = [
        state.canvas(),
        ...state.undoBuffer()
      ].slice(0, bufferSize);

      state.update(currState => ({
        ...currState,
        redoBuffer: [],
        undoBuffer
      }));
    },

    undo: (): void => {
      const [lastUndo, ...undoBuffer] = state.undoBuffer();
      state.update(currState => ({
        ...currState,
        canvas: lastUndo,
        redoBuffer: [
          currState.canvas,
          ...currState.redoBuffer
        ].slice(0, bufferSize),
        undoBuffer
      }));
    },

    redo: (): void => {
      const [lastRedo, ...redoBuffer] = state.redoBuffer();
      state.update(currState => ({
        ...currState,
        canvas: lastRedo,
        undoBuffer: [
          currState.canvas,
          ...currState.undoBuffer
        ].slice(0, bufferSize),
        redoBuffer
      }));
    }
  };
  
  return Object.assign(state, methods);
}