import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasService } from '../../services/canvas.service';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'sf-navbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-light p-3 m-3 flex flex-wrap gap-2 items-center">
      <button class="icon-button" (click)="toggleMenu.emit()">
        <sf-icon>menu</sf-icon>
      </button>

      SpriteForge!

      @if (darkModeService.darkModeSignal()) {
        <button class="icon-button" title="Dark mode" (click)="darkModeService.toggleDarkMode(false)">
          <sf-icon>dark_mode</sf-icon>
        </button>
      } @else {
        <button class="icon-button" title="Light mode" (click)="darkModeService.toggleDarkMode(true)">
          <sf-icon>light_mode</sf-icon>
        </button>
      }

      <button class="icon-button" title="New" (click)="newFile.emit()">
        <sf-icon>note_add</sf-icon>
      </button>

      <button
        class="icon-button"
        title="Undo"
        (click)="canvasService.state.undo()"
        [disabled]="canvasService.state.undoBuffer().length === 0">
        <sf-icon>undo</sf-icon>
      </button>
      <button
        class="icon-button"
        title="Redo"
        (click)="canvasService.state.redo()"
        [disabled]="canvasService.state.redoBuffer().length === 0">
        <sf-icon>redo</sf-icon>
      </button>

      <button class="icon-button" title="Open" (click)="openFile.emit()">
        <sf-icon>folder_open</sf-icon>
      </button>
      <button class="icon-button" title="Save" (click)="saveFile.emit()" [disabled]="!canvasService.state.started()">
        <sf-icon>save</sf-icon>
      </button>
      <button class="icon-button" title="Export" (click)="exportFile.emit()" [disabled]="!canvasService.state.started()">
        <sf-icon>upload</sf-icon>
      </button>
      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  darkModeService = inject(DarkModeService);
  canvasService = inject(CanvasService);

  toggleMenu = output<void>();
  newFile = output<void>();
  openFile = output<void>();
  saveFile = output<void>();
  importFile = output<void>();
  exportFile = output<void>();

  constructor() {
    effect(() => {
      const darkMode = this.darkModeService.darkModeSignal();

      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    })
  }

}
