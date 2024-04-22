import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasTool } from '../../interfaces/canvas-state.interface';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  selector: 'sf-toolbar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [IconComponent, TooltipDirective],
  template: `
    <div class="bg-light p-2 flex flex-wrap gap-2 rounded-xl">
      <sl-tooltip content="Colour Palette">
        <sl-button class="palette-button" variant="default" circle [style]="'--palette-color: ' + colour()" (click)="togglePalette()">
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Toggle grid">
        <sl-button variant="default" circle (click)="toggleGrid.emit()" [variant]="showGrid() ? 'primary': 'default'">
          <sl-icon name="grid-3x3"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Vertical mirror">
        <sl-button variant="default" circle (click)="mirrorVertical.emit()" [variant]="mirrorY() ? 'primary': 'default'">
          <sl-icon name="symmetry-vertical"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Horizontal mirror">
        <sl-button variant="default" circle (click)="mirrorHorizontal.emit()" [variant]="mirrorX() ? 'primary': 'default'">
          <sl-icon name="symmetry-horizontal"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <div class="border border-r mx-1"></div>

      <sl-tooltip content="Draw tool">
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Draw)" [variant]="tool() === ToolEnum.Draw ? 'primary': 'default'">
          <sl-icon name="brush"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Line tool">
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Line)" [variant]="tool() === ToolEnum.Line ? 'primary': 'default'">
          <sl-icon name="pencil"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Eraser">
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Erase)" [variant]="tool() === ToolEnum.Erase ? 'primary': 'default'">
          <sl-icon name="eraser"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Rectangle tool">
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Rectangle)" [variant]="tool() === ToolEnum.Rectangle ? 'primary': 'default'">
          <sl-icon name="bounding-box-circles"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Ellipse tool">
        <sl-button variant="default" circle (click)="updateTool.emit(ToolEnum.Circle)" [variant]="tool() === ToolEnum.Circle ? 'primary': 'default'">
          <sl-icon name="circle"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Fill tool">
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
