import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';

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

  @Output()
  updateColour = new EventEmitter<string>();

  onInput(e: Event): void {
    this.updateColour.emit((e.target as HTMLInputElement).value);
  }
}
