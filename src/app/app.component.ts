import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CanvasService } from './services/canvas.service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { IconComponent } from './shared/components/icon/icon.component';

@Component({
  selector: 'app-root',
  imports: [CanvasComponent, IconComponent],
  standalone: true,
  template: `
    <div class="flex h-100 w-100 p-4 gap-4">
      <div #menu class="sidebar transition-all p-4 rounded-2xl" [style.marginLeft.px]="menuMargin()">
        <h5>Menu</h5>
      </div>

      <div class="flex-1 relative">
        <div class="flex flex-col">
          <div class="toolbar p-3 rounded-2xl">
            <sf-icon (click)="toggleMenu()">menu</sf-icon> SpriteForge!

            <button (click)="undo()" [disabled]="canvasService.undoRedoState.undoBuffer().length === 0"><sf-icon>undo</sf-icon></button>
            <button (click)="redo()" [disabled]="canvasService.undoRedoState.redoBuffer().length === 0"><sf-icon>redo</sf-icon></button>
          </div>

          <div class="center-xy absolute canvas-container">
            @if (canvasService.canvasState.started()) {
              <sf-canvas></sf-canvas>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      background-color: var(--sf-bg-light);
      width: 250px;
    }

    .toolbar {
      background-color: var(--sf-bg-light);
    }

    .canvas-container {
      max-width: 100%;
      width: 600px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  menuElem = viewChild.required<ElementRef<HTMLElement>>('menu');

  canvasService = inject(CanvasService);

  menuMargin = signal<number>(0);

  constructor() {
    this.canvasService.initCanvas(16, 16);
  }

  toggleMenu(): void {
    this.menuMargin.update(margin => margin === 0
      ? -(this.menuElem().nativeElement.clientWidth + 24)
      : 0);
  }

  undo(): void {
    this.canvasService.undo();
  }

  redo(): void {
    this.canvasService.redo();
  }
}
