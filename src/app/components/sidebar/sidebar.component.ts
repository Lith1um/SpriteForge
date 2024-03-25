import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { PalettesService } from '../../services/palettes.service';

@Component({
  selector: 'sf-sidebar',
  standalone: true,
  template: `
    <div class="sidebar shadow z-5 pl-3 absolute top-0 bottom-0 transition-all" [class.translate-none]="show()">
      <div class="bg-light p-3 rounded-2xl h-100">
        <h5>Menu</h5>
        <div>Recent colours</div>
        <div class="grid gap-1 used-colours">
          @for (colour of palettesService.recentlyUsedSignal(); track $index) {
            <div
              class="w-100 colour"
              [style.backgroundColor]="colour"
              (click)="updateColour.emit(colour)">
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      transform: translateX(-100%);
      max-width: 80%;
      width: 300px;
    }

    .used-colours {
      grid-template-columns: repeat(5, 1fr);
    }

    .colour {
      aspect-ratio: 1 / 1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  palettesService = inject(PalettesService);

  show = model.required<boolean>();

  updateColour = output<string>();
}
