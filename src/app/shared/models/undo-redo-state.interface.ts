import { Pixel } from "../../interfaces/pixel.interface";

export interface UndoRedoState {

  undoBuffer: Pixel[][];
  redoBuffer: Pixel[][];

}
