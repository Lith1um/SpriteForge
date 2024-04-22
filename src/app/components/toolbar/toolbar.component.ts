import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CanvasTool } from '../../interfaces/canvas-state.interface';
import { SnippetComponent } from '../../shared/components/snippet/snippet.component';

@Component({
  selector: 'sf-toolbar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [SnippetComponent],
  standalone: true,
  template: `
    <div class="bg-light p-2 flex flex-wrap gap-2 rounded-xl">
      <sl-tooltip content="Colour Palette">
        <sl-button class="palette-button" variant="default" circle [style]="'--palette-color: ' + colour()" (click)="togglePalette()">
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Toggle grid
          <sf-snippet [invert]="true">g</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="toggleGrid.emit()" [variant]="showGrid() ? 'primary': 'default'">
          <sl-icon name="grid-3x3"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Vertical mirror
          <sf-snippet [invert]="true">v</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="mirrorVertical.emit()" [variant]="mirrorY() ? 'primary': 'default'">
          <sl-icon name="symmetry-vertical"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Horizontal mirror
          <sf-snippet [invert]="true">h</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="mirrorHorizontal.emit()" [variant]="mirrorX() ? 'primary': 'default'">
          <sl-icon name="symmetry-horizontal"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <div class="border border-r mx-1"></div>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Draw tool
          <sf-snippet [invert]="true">d</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Draw)" [variant]="tool() === ToolEnum.Draw ? 'primary': 'default'">
          <sl-icon name="brush"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Line tool
          <sf-snippet [invert]="true">l</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Line)" [variant]="tool() === ToolEnum.Line ? 'primary': 'default'">
          <sl-icon name="pencil"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Eraser
          <sf-snippet [invert]="true">e</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Erase)" [variant]="tool() === ToolEnum.Erase ? 'primary': 'default'">
          <sl-icon name="eraser"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Rectangle tool
          <sf-snippet [invert]="true">r</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Rectangle)" [variant]="tool() === ToolEnum.Rectangle ? 'primary': 'default'">
          <sl-icon name="bounding-box-circles"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Ellipse tool
          <sf-snippet [invert]="true">c</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Circle)" [variant]="tool() === ToolEnum.Circle ? 'primary': 'default'">
          <sl-icon name="circle"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip>
        <div slot="content" class="flex gap-2">
          Fill tool
          <sf-snippet [invert]="true">f</sf-snippet>
        </div>
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Fill)" [variant]="tool() === ToolEnum.Fill ? 'primary': 'default'">
          <sl-icon name="paint-bucket"></sl-icon>
        </sl-button>
      </sl-tooltip>
      
      <div class="border border-r mx-1"></div>

      <sl-tooltip content="Clear canvas">
        <sl-button variant="default" circle (click)="clearCanvas.emit()">
          <sl-icon name="trash"></sl-icon>
        </sl-button>
      </sl-tooltip>
    </div>
  `,
  styles: [`
    sl-button.palette-button::part(base) {
      background-color: var(--palette-color);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {

  colour = input.required<string>();
  tool = input.required<CanvasTool>();

  showGrid = input.required<boolean>();
  mirrorX = input.required<boolean>();
  mirrorY = input.required<boolean>();

  showPalette = model.required<boolean>();

  readonly ToolEnum = CanvasTool;

  updateTool = output<CanvasTool>();
  clearCanvas = output<void>();
  toggleGrid = output<void>();
  mirrorHorizontal = output<void>();
  mirrorVertical = output<void>();

  togglePalette(): void {
    this.showPalette.update(show => !show);
  }
}
