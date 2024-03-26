import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CanvasService } from './services/canvas.service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { IconComponent } from './shared/components/icon/icon.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SaveModalComponent } from './components/modals/save-modal.component';
import { LoadModalComponent } from './components/modals/load-modal.component';
import { SavedModel } from './interfaces/saved-model.model';
import { UndoRedoDirective } from './directives/undo-redo.directive';
import { SaveOpenDirective } from './directives/save-open.directive';
import { ToolSelectDirective } from './directives/tool-select.directive';
import { NewModalComponent } from './components/modals/new-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ExportModalComponent } from './components/modals/export-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    CanvasComponent,
    IconComponent,
    ToolbarComponent,
    LoadModalComponent,
    SaveModalComponent,
    ExportModalComponent,
    UndoRedoDirective,
    SaveOpenDirective,
    ToolSelectDirective,
    NavbarComponent,
    NewModalComponent,
    SidebarComponent,
  ],
  standalone: true,
  template: `
    <div class="flex h-100 w-100 flex-col">
      <sf-navbar
        (toggleMenu)="toggleMenu()"
        (newFile)="newModelVisible.set(true)"
        (openFile)="openModelVisible.set(true)"
        (saveFile)="triggerSave()"
        (exportFile)="exportModelVisible.set(true)">
      </sf-navbar>

      <div class="flex-1 min-h-0 relative">
        <sf-sidebar
          [(show)]="menuOpen"
          (updateColour)="canvasService.state.colour.set($event)">
        </sf-sidebar>

        @if (canvasService.state.started()) {
          <sf-canvas
            sfUndoRedo
            sfSaveOpen
            sfToolSelect
            (saveAs)="saveModelVisible.set(true)"
            (openModel)="openModelVisible.set(true)">
          </sf-canvas>
        }
      </div>

      @if (canvasService.state.started()) {
        <sf-toolbar
          class="mx-auto flex p-3"
          [colour]="canvasService.state.colour()"
          [tool]="canvasService.state.tool()"
          [mirrorX]="canvasService.state.mirrorHorizontal()"
          [mirrorY]="canvasService.state.mirrorVertical()"
          (updateColour)="canvasService.state.colour.set($event)"
          (updateTool)="canvasService.state.tool.set($event)"
          (clearCanvas)="canvasService.clearCanvas()"
          (mirrorHorizontal)="toggleMirrorX()"
          (mirrorVertical)="toggleMirrorY()">
        </sf-toolbar>
      }
    </div>

    <sf-new-modal
      [(visible)]="newModelVisible"
      [(width)]="width"
      [(height)]="height"
      (startCanvas)="startCanvas()">
    </sf-new-modal>

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

    <sf-export-modal
      [(visible)]="exportModelVisible"
      [canvas]="canvasService.state.canvas()"
      [width]="canvasService.state.width()"
      [height]="canvasService.state.height()">
    </sf-export-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  canvasService = inject(CanvasService);
  
  menuOpen = signal<boolean>(false);
  newModelVisible = signal<boolean>(false);
  openModelVisible = signal<boolean>(false);
  saveModelVisible = signal<boolean>(false);
  exportModelVisible = signal<boolean>(false);

  width = signal<number>(32);
  height = signal<number>(32);

  constructor() {
    this.startCanvas();
  }

  startCanvas(): void {
    this.canvasService.initCanvas(this.width(), this.height());
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  toggleMirrorX(): void {
    this.canvasService.state.mirrorHorizontal.update(mirrorX => !mirrorX);
  }

  toggleMirrorY(): void {
    this.canvasService.state.mirrorVertical.update(mirrorY => !mirrorY);
  }

  triggerSave(): void {
    if (!this.canvasService.state.filename()) {
      this.saveModelVisible.set(true);
    } else {
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
