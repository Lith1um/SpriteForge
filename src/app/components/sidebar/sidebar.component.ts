import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output } from '@angular/core';
import { PalettesService } from '../../services/palettes.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'sf-sidebar',
  standalone: true,
  template: `
    <div
      class="sidebar transition-all h-100 mr-3"
      [class.sidebar-mobile]="isMobile()"
      [class.show]="show()">
      <div class="bg-light p-3 h-100 overflow-y-auto">
        <h5>Options</h5>

        <div>Colours in model</div>
        <div class="palette-container overflow-y-auto mb-3">
          <div class="grid used-colours border border-1 ">
            @for (colour of usedColours(); track $index) {
              <div
                class="w-100 colour pointer"
                [class.selected]="selectedColour() === colour"
                [style.backgroundColor]="colour"
                (click)="clickedColour(colour)">
              </div>
            } @empty {
              <div class="text-center p-2" [style.gridColumn]="'1 / span 5'">
                No colours in use
              </div>
            }
          </div>
        </div>

        <div>Recent colours</div>
        <div class="palette-container overflow-y-auto mb-3">
          <div class="grid used-colours border border-1">
            @for (colour of palettesService.recentlyUsedSignal(); track $index) {
              <div
                class="w-100 colour pointer"
                [class.selected]="selectedColour() === colour"
                [style.backgroundColor]="colour"
                (click)="clickedColour(colour)">
              </div>
            } @empty {
              <div class="text-center p-2" [style.gridColumn]="'1 / span 5'">
                No recently used colours
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 300px;
      margin-left: calc(-300px - 1rem);

      &.show {
        margin-left: 0;
      }
    }
    
    .sidebar-mobile {
      position: absolute;
      z-index: 5;
      top: 0;
      bottom: 0;
      transform: translateX(0%);
      max-width: 80%;
      
      &.show {
        transform: translate3d(0, 0, 0);
      }
    }

    .palette-container {
      max-height: 251px;
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
export class SidebarComponent {
  canvasService = inject(CanvasService);
  palettesService = inject(PalettesService);

  selectedColour = input.required<string>();

  resize = toSignal(fromEvent(window, 'resize').pipe(startWith(false), debounceTime(10)));
  isMobile = computed(() => {
    // trigger on resize
    this.resize();
    return window.innerWidth <= 768;
  });

  usedColours = computed(() => {
    const canvas = this.canvasService.state.canvas();
    const usedColours = new Set<string>();

    canvas.forEach(pixel => pixel.colour && usedColours.add(pixel.colour));
    return Array.from(usedColours);
  });

  show = model.required<boolean>();

  updateColour = output<string>();

  constructor() {
    effect(() => {
      if (this.isMobile()) {
        this.show.set(false);
      }
    }, {allowSignalWrites: true});
  }

  clickedColour(colour: string): void {
    this.updateColour.emit(colour);
    if (this.isMobile()) {
      this.show.set(false);
    }
  }

}
