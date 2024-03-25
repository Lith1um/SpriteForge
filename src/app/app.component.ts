import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
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
import { ToolSelectDirective } from './directives/tool-select.directive';
import { NewCanvasComponent } from './components/new-canvas/new-canvas.component';

@Component({
  selector: 'app-root',
  imports: [
    CanvasComponent,
    IconComponent,
    ToolbarComponent,
    LoadModalComponent,
    SaveModalComponent,
    UndoRedoDirective,
    SaveOpenDirective,
    ToolSelectDirective,
    NewCanvasComponent,
  ],
  standalone: true,
  template: `
    <div class="flex h-100 w-100 flex-col">
      <div class="bg-light p-3 m-3 rounded-2xl flex gap-2 items-center">
        <button (click)="toggleMenu()">
          <sf-icon>menu</sf-icon>
        </button>

        SpriteForge!

        <button title="New" (click)="canvasService.newFile()">
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

        <button title="Open" (click)="openModelVisible.set(true)">
          <sf-icon>folder_open</sf-icon>
        </button>
        <button title="Save as" (click)="triggerSave()" [disabled]="!canvasService.state.started()">
          <sf-icon>save</sf-icon>
        </button>
      </div>

      <div class="flex-1 flex items-stretch justify-stretch min-h-0 relative">
        <div class="sidebar pl-3 absolute top-0 bottom-0 transition-all" [class.translate-none]="menuOpen()">
          <div class="bg-light p-3 rounded-2xl h-100">
            <h5>Menu</h5>
          </div>
        </div>

        @if (canvasService.state.started()) {
          <sf-canvas
            sfUndoRedo
            sfSaveOpen
            sfToolSelect
            (saveAs)="saveModelVisible.set(true)"
            (openModel)="openModelVisible.set(true)"
            class="canvas-container mx-auto"
            [style.aspectRatio]="canvasService.state.width() + '/' + canvasService.state.height()">
          </sf-canvas>
        } @else {
          <sf-new-canvas
            class="mx-auto"
            [(width)]="width"
            [(height)]="height"
            (startCanvas)="startCanvas()">
          </sf-new-canvas>
        }
      </div>

      @if (canvasService.state.started()) {
        <sf-toolbar
          class="mx-auto flex p-3"
          [colour]="canvasService.state.colour()"
          [tool]="canvasService.state.tool()"
          (updateColour)="canvasService.state.colour.set($event)"
          (updateTool)="canvasService.state.tool.set($event)"
          (clearCanvas)="canvasService.clearCanvas()">
        </sf-toolbar>
      }
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
      transform: translateX(-100%);
    }

    .canvas-container {
      max-width: 100%;
      max-height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  canvasService = inject(CanvasService);
  
  menuOpen = signal<boolean>(false);
  openModelVisible = signal<boolean>(false);
  saveModelVisible = signal<boolean>(false);

  width = signal<number>(16);
  height = signal<number>(16);

  startCanvas(): void {
    this.canvasService.initCanvas(this.width(), this.height());
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
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
