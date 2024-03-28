import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'sf-palette',
  standalone: true,
  template: `
    <h6>{{ name() }}</h6>
    <div class="palette-container overflow-y-auto mb-4">
      <div class="grid used-colours border border-1">
        @for (colour of colours(); track $index) {
          <div
            class="w-100 colour pointer"
            [class.selected]="selectedColour() === colour"
            [style.backgroundColor]="colour"
            (click)="updateColour.emit(colour)">
          </div>
        } @empty {
          <div class="text-center p-2" [style.gridColumn]="'1 / span 5'">
            None
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .palette-container {
      max-height: 200px;
    }

    .used-colours {
      gap: 1px;
      background-color: var(--sf-bg);
      grid-template-columns: repeat(5, 1fr);
    }

    .colour {
      aspect-ratio: 1 / 1;

      &.selected {
        box-shadow: inset 0px 0px 0px 0.25rem white;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteComponent {
  name = input.required<string>();
  colours = input.required<string[] | null>();
  selectedColour = input.required<string>();

  updateColour = output<string>();
}
