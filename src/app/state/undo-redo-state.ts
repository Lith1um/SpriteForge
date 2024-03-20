import { Pixel } from "../interfaces/pixel.interface";
import { UndoRedoState } from "../shared/models/undo-redo-state.interface";
import { objectSignal } from "../shared/state/object-signal-state";

export const undoRedoState = (initialState: UndoRedoState) => {

  const bufferSize = 50;

  const state = objectSignal<UndoRedoState>(initialState);

  const methods = {
    commit: (currentState: Pixel[]): void => {
      const undoBuffer = [
        currentState,
        ...state().undoBuffer
      ].slice(0, bufferSize);

      state.set({
        redoBuffer: [],
        undoBuffer
      });
    },
    undo: (currentPixels: Pixel[]): Pixel[] | undefined => {
      const [lastUndo, ...undoBuffer] = state.undoBuffer();
      state.update(currState => ({
        redoBuffer: [
          currentPixels,
          ...currState.redoBuffer
        ].slice(0, bufferSize),
        undoBuffer
      }));
      return lastUndo;
    },
    redo: (currentPixels: Pixel[]): Pixel[] | undefined => {
      const [lastRedo, ...redoBuffer] = state.redoBuffer();
      state.update(currState => ({
        undoBuffer: [
          currentPixels,
          ...currState.undoBuffer
        ].slice(0, bufferSize),
        redoBuffer
      }));
      return lastRedo;
    }
  };
  
  return Object.assign(state, methods);
}