import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CanvasTool } from '../../interfaces/canvas-state.interface';

@Component({
  selector: 'sf-toolbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="toolbar p-3 rounded-2xl flex gap-2">
      Toolbar
      <label>
        <input type="color" class="h-100 w-0 border-0 m-0 p-0 invisible" [value]="colour()" (change)="onInput($event)"/>
        <sf-icon [style.color]="colour()">palette</sf-icon>
      </label>

      <button [disabled]="tool() === ToolEnum.Draw" (click)="updateTool.emit(ToolEnum.Draw)">
        <sf-icon>draw</sf-icon>
      </button>

      <button [disabled]="tool() === ToolEnum.Line" (click)="updateTool.emit(ToolEnum.Line)">
        <sf-icon>drive_file_rename_outline</sf-icon>
      </button>

      <button [disabled]="tool() === ToolEnum.Fill" (click)="updateTool.emit(ToolEnum.Fill)">
        <sf-icon>format_color_fill</sf-icon>
      </button>
    </div>
  `,
  styles: [`
    .toolbar {
      background-color: var(--sf-bg-light);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {

  colour = input.required<string>();
  tool = input.required<CanvasTool>();

  readonly ToolEnum = CanvasTool;

  @Output()
  updateColour = new EventEmitter<string>();

  @Output()
  updateTool = new EventEmitter<CanvasTool>();

  onInput(e: Event): void {
    this.updateColour.emit((e.target as HTMLInputElement).value);
  }
}
