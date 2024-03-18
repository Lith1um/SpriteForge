import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sf-icon',
  standalone: true,
  template: `
    <i class="icon">
      <ng-content></ng-content>  
    </i>
  `,
  styles: [`
    .icon {
      font-family: 'Material Symbols Rounded';
      font-weight: normal;
      font-style: normal;
      font-size: 1.4em;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
      vertical-align: top;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {}
