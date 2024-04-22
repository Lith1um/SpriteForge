import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sf-snippet',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div 
      class="snippet inline-flex items-center text-sm rounded-sm border-1"
      [ngClass]="invert() ? 'bg-dark border-light' : 'bg-light border-dark'">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      vertical-align: top;
      font-family: courier;
    }
    .snippet {
      padding: 0 0.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetComponent {
  invert = input<boolean>(false);
}
