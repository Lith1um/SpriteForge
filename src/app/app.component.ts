import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CanvasService } from './services/canvas.service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { IconComponent } from './shared/components/icon/icon.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SaveModalComponent } from './components/save-modal/save-modal.component';
import { LoadModalComponent } from './components/load-modal/load-modal.component';
import { SavedModel } from './interfaces/saved-model.model';
import { FormsModule } from '@angular/forms';
import { UndoRedoDirective } from './directives/undo-redo.directive';
import { SaveOpenDirective } from './directives/save-open.directive';

@Component({
  selector: 'app-root',
  imports: [
    CanvasComponent,
    IconComponent,
    ToolbarComponent,
    LoadModalComponent,
    SaveModalComponent,
    FormsModule,
    UndoRedoDirective,
    SaveOpenDirective
  ],
  standalone: true,
  template: `
    <div class="flex h-100 w-100 p-4 gap-4">
      <div #menu class="bg-light sidebar transition-all p-4 rounded-2xl" [style.marginLeft.px]="menuMargin()">
        <h5>Menu</h5>
      </div>

      <div class="flex-1 relative min-w-0">
        <div class="flex flex-col h-100 gap-4">
          <div class="bg-light p-3 rounded-2xl flex gap-2">
            <button (click)="toggleMenu()"><sf-icon>menu</sf-icon></button> SpriteForge!

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

            <button title="Open" (click)="openModelVisible.set(true)">
              <sf-icon>folder_open</sf-icon>
            </button>
            <button title="Save as" (click)="triggerSaveAs()">
              <sf-icon>save</sf-icon>
              Save As
            </button>
            <button title="Save" (click)="triggerSave()" [disabled]="!canvasService.state.filename()">
              <sf-icon>save</sf-icon>
            </button>
          </div>

          <div class="flex-1 flex items-stretch justify-stretch min-h-0">
            @if (canvasService.state.started()) {
              <sf-canvas
                sfUndoRedo
                sfSaveOpen
                (saveAs)="saveModelVisible.set(true)"
                (openModel)="openModelVisible.set(true)"
                class="canvas-container mx-auto"
                [style.aspectRatio]="canvasService.state.width() + '/' + canvasService.state.height()">
              </sf-canvas>
            } @else {
              <div class="flex flex-col gap-2 items-center mx-auto">
                <label>
                  Width
                  <input type="number" [(ngModel)]="width"/>
                </label>
                <label>
                  Height
                  <input type="number" [(ngModel)]="height"/>
                </label>

                <button [disabled]="!width() || !height()" (click)="startCanvas()">
                  Start painting
                </button>
              </div>
            }
          </div>

          <sf-toolbar
            class="mx-auto flex"
            [colour]="canvasService.state.colour()"
            [tool]="canvasService.state.tool()"
            (updateColour)="canvasService.state.colour.set($event)"
            (updateTool)="canvasService.state.tool.set($event)"
            (clearCanvas)="canvasService.clearCanvas()">
          </sf-toolbar>
        </div>
      </div>
    </div>

    <sf-load-modal
      [(visible)]="openModelVisible"
      (load)="loadModel($event)">
    </sf-load-modal>

    <sf-save-modal
      [(visible)]="saveModelVisible"
      [canvas]="canvasService.state.canvas()"
      [width]="canvasService.state.width()"
      [height]="canvasService.state.height()"
      (save)="saveModel($event)">
    </sf-save-modal>
  `,
  styles: [`
    .sidebar {
      width: 250px;
    }

    .canvas-container {
      max-width: 100%;
      max-height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  menuElem = viewChild.required<ElementRef<HTMLElement>>('menu');

  canvasService = inject(CanvasService);

  menuMargin = signal<number>(0);
  openModelVisible = signal<boolean>(false);
  saveModelVisible = signal<boolean>(false);

  width = signal<number>(16);
  height = signal<number>(16);

  startCanvas(): void {
    this.canvasService.initCanvas(this.width(), this.height());
  }

  toggleMenu(): void {
    this.menuMargin.update(margin => margin === 0
      // TODO: fix
      ? -(this.menuElem().nativeElement.clientWidth + 24)
      : 0);
  }

  triggerSaveAs(): void {
    this.saveModelVisible.set(true);
  }

  triggerSave(): void {
    if (!this.canvasService.state.filename()) {
      this.saveModelVisible.set(true);
    } else {
      // trigger a save
      this.canvasService.save();
    }
  }

  saveModel(filename: string): void {
    this.canvasService.saveAs(filename);
    this.saveModelVisible.set(false);
  }

  loadModel(model: SavedModel): void {
    this.canvasService.load(model);
  }
}
