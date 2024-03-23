import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasTool } from '../../interfaces/canvas-state.interface';
import { debounce } from '../../shared/helpers/debounce';

@Component({
  selector: 'sf-toolbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-light p-3 rounded-2xl flex gap-2">
      <label class="flex" title="colour">
        <input #colorInput type="color" class="h-100 w-0 border-0 m-0 p-0 invisible" [value]="colour()" (input)="onInput($event)"/>
        <button (click)="colorInput.click()">
          <sf-icon [style.color]="colour()">palette</sf-icon>
        </button>
      </label>

      <div class="border-dark border-r"></div>

      <button title="pencil" [disabled]="tool() === ToolEnum.Draw" (click)="updateTool.emit(ToolEnum.Draw)">
        <sf-icon>draw</sf-icon>
      </button>

      <button title="line" [disabled]="tool() === ToolEnum.Line" (click)="updateTool.emit(ToolEnum.Line)">
        <sf-icon>drive_file_rename_outline</sf-icon>
      </button>

      <button title="fill" [disabled]="tool() === ToolEnum.Fill" (click)="updateTool.emit(ToolEnum.Fill)">
        <sf-icon>format_color_fill</sf-icon>
      </button>

      <div class="border-dark border-r"></div>

      <button title="clear canvas" (click)="clearCanvas.emit()">
        <sf-icon>delete</sf-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {

  colour = input.required<string>();
  tool = input.required<CanvasTool>();

  readonly ToolEnum = CanvasTool;

  updateColour = output<string>();
  updateTool = output<CanvasTool>();
  clearCanvas = output<void>();

  debounceColor = debounce((colour: string) => this.updateColour.emit(colour));

  onInput(e: Event): void {
    this.debounceColor((<HTMLInputElement>e.target).value);
  }
}
