import { Directive, HostListener, inject } from '@angular/core';
import { CanvasService } from '../services/canvas.service';

@Directive({
  selector: '[sfUndoRedo]',
  standalone: true,
})
export class UndoRedoDirective {

  canvasService = inject(CanvasService);

  @HostListener('window:keydown.control.z') 
  @HostListener('window:keydown.meta.z') 
  onCtrlZ(): boolean {
    this.canvasService.undo();
    return false;
  }

  @HostListener('window:keydown.control.shift.z')
  @HostListener('window:keydown.meta.shift.z')
  onShiftCtrlZ(): boolean {
    this.canvasService.redo();
    return false;
  }

}
