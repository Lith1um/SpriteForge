import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'sf-navbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-light p-3 m-3 rounded-2xl flex flex-wrap gap-2 items-center">
      <button (click)="toggleMenu.emit()">
        <sf-icon>menu</sf-icon>
      </button>

      SpriteForge!

      <button title="New" (click)="newFile.emit()">
        <sf-icon>note_add</sf-icon>
      </button>

      <button
        title="Undo"
        (click)="canvasService.state.undo()"
        [disabled]="canvasService.state.undoBuffer().length === 0">
        <sf-icon>undo</sf-icon>
      </button>
      <button
        title="Redo"
        (click)="canvasService.state.redo()"
        [disabled]="canvasService.state.redoBuffer().length === 0">
        <sf-icon>redo</sf-icon>
      </button>

      <button title="Open" (click)="openFile.emit()">
        <sf-icon>folder_open</sf-icon>
      </button>
      <button title="Save as" (click)="saveFile.emit()" [disabled]="!canvasService.state.started()">
        <sf-icon>save</sf-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  canvasService = inject(CanvasService);

  toggleMenu = output<void>();
  newFile = output<void>();
  openFile = output<void>();
  saveFile = output<void>();

}
