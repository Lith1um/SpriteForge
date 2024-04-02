import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasService } from '../../services/canvas.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  selector: 'sf-navbar',
  standalone: true,
  imports: [IconComponent, TooltipDirective],
  template: `
    <div class="bg-light p-3 m-3 flex flex-wrap gap-2">
      <button sfTooltip tooltipText="Menu" class="icon-button" (click)="toggleMenu.emit()">
        <sf-icon>menu</sf-icon>
      </button>

      <div class="text-lg font-weight-bold">SpriteForge</div>

      <button
        sfTooltip
        class="icon-button"
        [tooltipText]="'Toggle light mode'"
        (click)="darkModeService.toggleDarkMode(!darkModeService.darkModeSignal())">
        <sf-icon>{{ darkModeService.darkModeSignal() ? 'dark_mode' : 'light_mode' }}</sf-icon>
      </button>

      <div class="border-dark border-r"></div>
    
      <button sfTooltip tooltipText="New file" class="icon-button" (click)="newFile.emit()">
        <sf-icon>note_add</sf-icon>
      </button>
      <button sfTooltip tooltipText="Save work" class="icon-button" (click)="saveFile.emit()" [disabled]="!canvasService.state.started()">
        <sf-icon>save</sf-icon>
      </button>
      <button sfTooltip tooltipText="Open file" class="icon-button" (click)="openFile.emit()">
        <sf-icon>folder_open</sf-icon>
      </button>

      <button
        sfTooltip
        tooltipText="Undo" 
        class="icon-button"
        (click)="canvasService.state.undo()"
        [disabled]="canvasService.state.undoBuffer().length === 0">
        <sf-icon>undo</sf-icon>
      </button>
      <button
        sfTooltip
        tooltipText="Redo" 
        class="icon-button"
        (click)="canvasService.state.redo()"
        [disabled]="canvasService.state.redoBuffer().length === 0">
        <sf-icon>redo</sf-icon>
      </button>

      <button sfTooltip tooltipText="Export .png" class="icon-button" (click)="exportFile.emit()" [disabled]="!canvasService.state.started()">
        <sf-icon>upload</sf-icon>
      </button>

      <button sfTooltip tooltipText="Shortcuts" class="icon-button" (click)="showShortcuts.emit()">
        <sf-icon>keyboard_command_key</sf-icon>
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
  showShortcuts = output<void>();

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
