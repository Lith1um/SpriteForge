import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasTool } from '../../interfaces/canvas-state.interface';
import { debounce } from '../../shared/helpers/debounce';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  selector: 'sf-toolbar',
  standalone: true,
  imports: [IconComponent, TooltipDirective],
  template: `
    <div class="bg-light p-3 flex flex-wrap gap-2">
      <label sfTooltip tooltipText="Colour Palette" class="flex">
        <button class="icon-button" [style.backgroundColor]="colour()" (click)="togglePalette()">
          <sf-icon style="color: transparent;">palette</sf-icon>
        </button>
      </label>

      <button sfTooltip tooltipText="Toggle grid" class="icon-button" [style.filter]="showGrid() ? 'invert(1)': ''" (click)="toggleGrid.emit()">
        <sf-icon>grid_on</sf-icon>
      </button>

      <button sfTooltip tooltipText="Horizontal mirror" class="icon-button" [style.filter]="mirrorY() ? 'invert(1)': ''" (click)="mirrorVertical.emit()">
        <sf-icon>flip</sf-icon>
      </button>

      <button sfTooltip tooltipText="Vertical mirror" class="icon-button" [style.filter]="mirrorX() ? 'invert(1)': ''" (click)="mirrorHorizontal.emit()">
        <sf-icon class="rotate-90 block">flip</sf-icon>
      </button>

      <div class="border-dark border-r"></div>

      <button sfTooltip tooltipText="Draw tool" class="icon-button" [style.filter]="tool() === ToolEnum.Draw ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Draw)">
        <sf-icon>brush</sf-icon>
      </button>

      <button sfTooltip tooltipText="Line tool" class="icon-button" [style.filter]="tool() === ToolEnum.Line ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Line)">
        <sf-icon>drive_file_rename_outline</sf-icon>
      </button>

      <button sfTooltip tooltipText="Eraser" class="icon-button" [style.filter]="tool() === ToolEnum.Erase ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Erase)">
        <sf-icon>ink_eraser</sf-icon>
      </button>

      <button sfTooltip tooltipText="Rectangle tool" class="icon-button" [style.filter]="tool() === ToolEnum.Rectangle ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Rectangle)">
        <sf-icon>rectangle</sf-icon>
      </button>

      <button sfTooltip tooltipText="Ellipse tool" class="icon-button" [style.filter]="tool() === ToolEnum.Circle ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Circle)">
        <sf-icon>brightness_1</sf-icon>
      </button>

      <button sfTooltip tooltipText="Fill tool" class="icon-button" [style.filter]="tool() === ToolEnum.Fill ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Fill)">
        <sf-icon>colors</sf-icon>
      </button>

      <div class="border-dark border-r"></div>

      <button sfTooltip tooltipText="Clear canvas" class="icon-button" (click)="clearCanvas.emit()">
        <sf-icon>delete</sf-icon>
      </button>
    </div>
  `,
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
