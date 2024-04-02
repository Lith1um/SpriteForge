import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
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
import { PaletteBarComponent } from './components/palette-bar/palette-bar.component';
import { ExportModalComponent } from './components/modals/export-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ShortcutService } from './services/shortcut.service';
import { ShortcutsModalComponent } from './components/modals/shortcuts-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    CanvasComponent,
    IconComponent,
    ToolbarComponent,
    ShortcutsModalComponent,
    LoadModalComponent,
    SaveModalComponent,
    ExportModalComponent,
    UndoRedoDirective,
    SaveOpenDirective,
    ToolSelectDirective,
    NavbarComponent,
    NewModalComponent,
    PaletteBarComponent,
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
        (exportFile)="exportModelVisible.set(true)"
        (showShortcuts)="shortcutsVisible.set(true)">
      </sf-navbar>

      <div class="flex-1 min-h-0 relative flex px-3 overflow-hidden">
        <sf-sidebar [(show)]="menuOpen"></sf-sidebar>

        @if (canvasService.state.started()) {
          <sf-canvas
            sfUndoRedo
            sfSaveOpen
            sfToolSelect
            (saveAs)="saveModelVisible.set(true)"
            (openModel)="openModelVisible.set(true)"
            (exportModel)="exportModelVisible.set(true)">
          </sf-canvas>
        }

        <sf-palette-bar
          [(show)]="paletteOpen"
          [selectedColour]="canvasService.state.colour()"
          (updateColour)="canvasService.state.colour.set($event)">
        </sf-palette-bar>
      </div>

      @if (canvasService.state.started()) {
        <sf-toolbar
          class="mx-auto flex p-3"
          [colour]="canvasService.state.colour()"
          [tool]="canvasService.state.tool()"
          [showGrid]="canvasService.state.showGrid()"
          [(showPalette)]="paletteOpen"
          [mirrorX]="canvasService.state.mirrorHorizontal()"
          [mirrorY]="canvasService.state.mirrorVertical()"
          (updateTool)="canvasService.state.tool.set($event)"
          (clearCanvas)="canvasService.clearCanvas()"
          (toggleGrid)="toggleGrid()"
          (mirrorHorizontal)="toggleMirrorX()"
          (mirrorVertical)="toggleMirrorY()">
        </sf-toolbar>
      }
    </div>

    <sf-shortcuts-modal [(visible)]="shortcutsVisible"></sf-shortcuts-modal>

    <sf-new-modal
      [(visible)]="newModelVisible"
      [(width)]="width"
      [(height)]="height"
      (startCanvas)="startCanvas()">
    </sf-new-modal>

    <sf-load-modal
      [(visible)]="openModelVisible"
      (load)="loadModel($event)"
      (deleteModel)="deleteModel($event)">
    </sf-load-modal>

    <sf-save-modal
      [(visible)]="saveModelVisible"
      [canvas]="canvasService.state.canvas()"
      [frames]="canvasService.state.animationFrames()"
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
  shortcutService = inject(ShortcutService);
  
  menuOpen = signal<boolean>(true);
  paletteOpen = signal<boolean>(true);

  newModelVisible = signal<boolean>(false);
  openModelVisible = signal<boolean>(false);
  saveModelVisible = signal<boolean>(false);
  exportModelVisible = signal<boolean>(false);
  shortcutsVisible = signal<boolean>(false);

  width = signal<number>(16);
  height = signal<number>(16);

  constructor() {
    this.startCanvas();

    // disable shortcuts when a modal is open
    effect(() => {
      if (this.newModelVisible() || this.openModelVisible() || this.saveModelVisible() || this.exportModelVisible()) {
        this.shortcutService.disable();
      } else {
        this.shortcutService.enable();
      }
    }, { allowSignalWrites: true })
  }

  startCanvas(): void {
    this.canvasService.initCanvas(this.width(), this.height());
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  toggleGrid(): void {
    this.canvasService.state.showGrid.update(show => !show);
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

  deleteModel(filename: string): void {
    this.canvasService.deleteModel(filename);
  }
}
