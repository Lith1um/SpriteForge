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

  @HostListener('window:keydown.control.o')
  @HostListener('window:keydown.meta.o')
  onCtrlO() {
    this.openModel.emit();
    return false;
  }

  @HostListener('window:keydown.control.s')
  @HostListener('window:keydown.meta.s')
  onCtrlS() {
    if (!this.canvasService.state.filename()) {
      this.saveAs.emit();
      return false;
    }
    this.canvasService.save();
    return false;
  }

  @HostListener('window:keydown.control.shift.s')
  @HostListener('window:keydown.meta.shift.s')
  onShiftCtrlS() {
    this.saveAs.emit();
    return false;
  }

}
