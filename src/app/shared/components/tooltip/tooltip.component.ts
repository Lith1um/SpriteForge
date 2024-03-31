import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'sf-tooltip',
  standalone: true,
  template: `
    <div class="animate-fade-in text-sm text-dark bg-dark p-1 px-2 rounded shadow" [class.invisible]="!visible()">
      {{ tooltipText() }}
      <div #arrow class="arrow absolute rotate-45 bg-dark"></div>
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      z-index: 9999;
      opacity: 0.85;
    }

    .arrow {
      width: 0.5rem;
      height: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  arrowRef = viewChild.required<ElementRef<HTMLElement>>('arrow');

  tooltipText = input.required<string>();

  visible = signal<boolean>(false);

  constructor(readonly host: ElementRef) {}
}
