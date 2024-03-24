import { CanvasState } from "../interfaces/canvas-state.interface";
import { Pixel } from "../interfaces/pixel.interface";
import { SavedModel } from "../interfaces/saved-model.model";
import { ObjectSignalState, objectSignal } from "../shared/state/object-signal-state";

export type CanvasStateSignal = ObjectSignalState<CanvasState> & {
  initCanvas: (width: number, height: number) => void;
  clearCanvas: () => void;
  updatePixel: (pixelIndex: number) => void;
  updatePixels: (pixelIndexes: number[]) => void;
  updateCanvas: (pixelIndexes: number[], canvas: Map<number, Pixel>) => void;
  commit: () => void;
  undo: () => void;
  redo: () => void;
  load: (model: SavedModel) => void;
}

// TODO: this should really be a service
export const canvasState = (initialState: CanvasState): CanvasStateSignal => {

  const state = objectSignal<CanvasState>(initialState);

  const bufferSize = 100;

  const methods = {
    initCanvas: (width: number, height: number): void => state.update(currState => ({
      ...currState,
      width,
      height,
      canvas: new Map(new Array(width * height).fill(undefined)
        .map((_, index) => ([index, { index, colour: null }]))),
      started: true
    })),

    clearCanvas: (): void => state.canvas.update(canvas => {
      const newCanvas = new Map();
      canvas.forEach((pixel, key) => newCanvas.set(key, { index: key, colour: null }))
      return newCanvas;
    }),

    updatePixel: (pixelIndex: number): void => {
      const newCanvas = new Map(state.canvas());
      newCanvas.set(pixelIndex, {
        index: pixelIndex,
        colour: state.colour()
      })
      state.canvas.set(newCanvas);
    },

    updatePixels: (pixelIndexes: number[]): void => {
      const newCanvas = new Map(state.canvas());
      pixelIndexes.forEach(pixelIndex => newCanvas.set(pixelIndex, {
        index: pixelIndex,
        colour: state.colour()
      }));
      state.canvas.set(newCanvas);
    },
    
    updateCanvas: (pixelIndexes: number[], canvas: Map<number, Pixel>): void => {
      const newCanvas = new Map(canvas);
      pixelIndexes.forEach(pixelIndex => newCanvas.set(pixelIndex, {
        index: pixelIndex,
        colour: state.colour()
      }));
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

      if (!lastUndo) {
        return;
      }

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

      if (!lastRedo) {
        return;
      }

      state.update(currState => ({
        ...currState,
        canvas: lastRedo,
        undoBuffer: [
          currState.canvas,
          ...currState.undoBuffer
        ].slice(0, bufferSize),
        redoBuffer
      }));
    },

    load: (model: SavedModel): void => {
      state.update(currState => ({
        ...currState,
        canvas: model.canvas,
        width: model.width,
        height: model.height,
        filename: model.filename,
        undoBuffer: [],
        redoBuffer: []
      }));
    }
  };
  
  return Object.assign(state, methods);
}