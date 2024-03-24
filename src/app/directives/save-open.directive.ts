import { Directive, HostListener, inject, output } from '@angular/core';
import { CanvasService } from '../services/canvas.service';

@Directive({
  selector: '[sfSaveOpen]',
  standalone: true,
})
export class SaveOpenDirective {

  canvasService = inject(CanvasService);

  saveAs = output<void>();
  openModel = output<void>();

  @HostListener('window:keydown.meta.o') onCtrlO() {
    this.openModel.emit();
  }

  @HostListener('window:keydown.meta.s') onCtrlS() {
    if (!this.canvasService.state.filename()) {
      this.saveAs.emit();
      return;
    }
    this.canvasService.save();
  }

  @HostListener('window:keydown.meta.shift.s') onShiftCtrlS() {
    this.saveAs.emit();
  }

}
