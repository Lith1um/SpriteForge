import { Directive, HostListener, inject, output } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { ShortcutService } from '../services/shortcut.service';

@Directive({
  selector: '[sfSaveOpen]',
  standalone: true,
})
export class SaveOpenDirective {

  canvasService = inject(CanvasService);
  shortcutService = inject(ShortcutService);

  saveAs = output<void>();
  openModel = output<void>();
  exportModel = output<void>();

  @HostListener('window:keydown.control.o')
  @HostListener('window:keydown.meta.o')
  onCtrlO() {
    if (!this.shortcutService.enabled()) {
      return false;
    }
    this.openModel.emit();
    return false;
  }

  @HostListener('window:keydown.control.e')
  @HostListener('window:keydown.meta.e')
  onCtrlE() {
    if (!this.shortcutService.enabled()) {
      return false;
    }
    this.exportModel.emit();
    return false;
  }

  @HostListener('window:keydown.control.s')
  @HostListener('window:keydown.meta.s')
  onCtrlS() {
    if (!this.shortcutService.enabled()) {
      return false;
    }
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
    if (!this.shortcutService.enabled()) {
      return false;
    }
    this.saveAs.emit();
    return false;
  }

}
