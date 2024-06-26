import { Signal, computed } from "@angular/core";
import { CanvasState, CanvasTool } from "../interfaces/canvas-state.interface";
import { Pixel } from "../interfaces/pixel.interface";
import { SavedModel } from "../interfaces/saved-model.model";
import { ObjectSignalState, objectSignal } from "../shared/state/object-signal-state";

export type CanvasStateSignal = ObjectSignalState<CanvasState> & {
  lastFrame: Signal<Map<number, Pixel>>;
  initCanvas: (width: number, height: number) => void;
  clearCanvas: () => void;
  updatePixels: (pixelIndexes: number[], erase?: boolean) => void;
  updateCanvas: (pixelIndexes: number[], canvas: Map<number, Pixel>) => void;
  commit: () => void;
  undo: () => void;
  redo: () => void;
  load: (model: SavedModel) => void;
}

// TODO: this should really be a service
export const canvasState = (): CanvasStateSignal => {

  const initialState: CanvasState = {
    canvas: new Map(),
    colour: '#000000',
    height: 0,
    painting: false,
    started: false,
    width: 0,
    filename: undefined,
    animationFrames: [],
    undoBuffer: [],
    redoBuffer: [],
    tool: CanvasTool.Draw,
    showGrid: true,
    mirrorHorizontal: false,
    mirrorVertical: false,
  };

  const state = objectSignal<CanvasState>(initialState);

  const bufferSize = 100;

  const methods = {
    lastFrame: computed(() => state.animationFrames()[state.animationFrames().length - 1]),

    initCanvas: (width: number, height: number): void => state.update(currState => ({
      ...currState,
      width,
      height,
      canvas: new Map(new Array(width * height).fill(undefined)
        .map((_, index) => ([index, {
          index,
          row: Math.floor(index / width),
          col: index % width,
          colour: null
        }]))),
      filename: undefined,
      started: true,
      animationFrames: [],
      undoBuffer: [],
      redoBuffer: [],
    })),

    clearCanvas: (): void => state.canvas.update(canvas => {
      const newCanvas = new Map<number, Pixel>();
      canvas.forEach((pixel, key) => newCanvas.set(key, { ...pixel, colour: null }));
      return newCanvas;
    }),

    updatePixels: (pixelIndexes: number[], erase?: boolean): void => {
      const newCanvas = new Map(state.canvas());
      pixelIndexes.forEach(pixelIndex => newCanvas.set(pixelIndex, {
        ...newCanvas.get(pixelIndex)!,
        colour: erase ? null : state.colour()
      }));
      state.canvas.set(newCanvas);
    },
    
    updateCanvas: (pixelIndexes: number[], canvas: Map<number, Pixel>): void => {
      const newCanvas = new Map(canvas);
      pixelIndexes.forEach(pixelIndex => newCanvas.set(pixelIndex, {
        ...newCanvas.get(pixelIndex)!,
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
        animationFrames: model.frames,
        width: model.width,
        height: model.height,
        filename: model.filename
      }));
    }
  };
  
  return Object.assign(state, methods);
}