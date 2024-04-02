import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sf-snippet',
  standalone: true,
  template: `
    <div class="snippet inline-flex text-sm rounded-sm bg-light border-dark border-1">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: text-bottom;
      font-family: courier;
    }
    .snippet {
      padding: 0 0.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetComponent {}
