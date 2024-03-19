import { Pixel } from "../../interfaces/pixel.interface";
import { UndoRedoState } from "../models/undo-redo-state.interface";
import { ObjectSignal } from "./object-signal-state";

export const undoRedoState = (initialState: UndoRedoState) => {

  const bufferSize = 50;

  const state = ObjectSignal<UndoRedoState>(initialState);

  const methods = {
    commit: (currentState: Pixel[]): void => {
      const undoBuffer = [
        currentState,
        ...state().undoBuffer
      ].slice(0, bufferSize);

      state.update({
        ...state(),
        undoBuffer
      });
    },
    undo: (currentPixels: Pixel[]): Pixel[] | undefined => {
      const [lastUndo, ...undoBuffer] = state.undoBuffer();
      state.update({
        redoBuffer: [
          currentPixels,
          ...state.redoBuffer()
        ].slice(0, bufferSize),
        undoBuffer
      });
      return lastUndo;
    },
    redo: (currentPixels: Pixel[]): Pixel[] | undefined => {
      const [lastRedo, ...redoBuffer] = state.redoBuffer();
      state.update({
        undoBuffer: [
          currentPixels,
          ...state.undoBuffer()
        ].slice(0, bufferSize),
        redoBuffer
      });
      return lastRedo;
    }
  };
  
  return Object.assign(state, methods);
}