import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasTool } from '../../interfaces/canvas-state.interface';
import { debounce } from '../../shared/helpers/debounce';

@Component({
  selector: 'sf-toolbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-light p-3 flex flex-wrap gap-2">
      <label class="flex" title="colour">
        <input #colorInput type="color" class="h-100 w-0 border-0 m-0 p-0 invisible" [value]="colour()" (input)="onInput($event)"/>
        <button class="icon-button" [style.backgroundColor]="colour()" (click)="colorInput.click()">
          <sf-icon style="color: transparent;">palette</sf-icon>
        </button>
      </label>

      <button class="icon-button" title="toggle grid" [style.filter]="showGrid() ? 'invert(1)': ''" (click)="toggleGrid.emit()">
        <sf-icon>grid_on</sf-icon>
      </button>

      <button class="icon-button" title="horizontal mirror" [style.filter]="mirrorY() ? 'invert(1)': ''" (click)="mirrorVertical.emit()">
        <sf-icon>flip</sf-icon>
      </button>

      <button class="icon-button" title="vertical mirror" [style.filter]="mirrorX() ? 'invert(1)': ''" (click)="mirrorHorizontal.emit()">
        <sf-icon class="rotate-90 block">flip</sf-icon>
      </button>

      <div class="border-dark border-r"></div>

      <button class="icon-button" title="draw" [style.filter]="tool() === ToolEnum.Draw ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Draw)">
        <sf-icon>brush</sf-icon>
      </button>

      <button class="icon-button" title="line" [style.filter]="tool() === ToolEnum.Line ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Line)">
        <sf-icon>drive_file_rename_outline</sf-icon>
      </button>

      <button class="icon-button" title="erase" [style.filter]="tool() === ToolEnum.Erase ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Erase)">
        <sf-icon>ink_eraser</sf-icon>
      </button>

      <button class="icon-button" title="rectangle" [style.filter]="tool() === ToolEnum.Rectangle ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Rectangle)">
        <sf-icon>rectangle</sf-icon>
      </button>

      <button class="icon-button" title="circle" [style.filter]="tool() === ToolEnum.Circle ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Circle)">
        <sf-icon>brightness_1</sf-icon>
      </button>

      <button class="icon-button" title="fill" [style.filter]="tool() === ToolEnum.Fill ? 'invert(1)': ''" (click)="updateTool.emit(ToolEnum.Fill)">
        <sf-icon>colors</sf-icon>
      </button>

      <div class="border-dark border-r"></div>

      <button class="icon-button" title="clear canvas" (click)="clearCanvas.emit()">
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

  readonly ToolEnum = CanvasTool;

  updateColour = output<string>();
  updateTool = output<CanvasTool>();
  clearCanvas = output<void>();
  toggleGrid = output<void>();
  mirrorHorizontal = output<void>();
  mirrorVertical = output<void>();

  debounceColor = debounce((colour: string) => this.updateColour.emit(colour));

  onInput(e: Event): void {
    this.debounceColor((<HTMLInputElement>e.target).value);
  }
}
