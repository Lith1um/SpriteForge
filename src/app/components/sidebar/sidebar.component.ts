import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output } from '@angular/core';
import { PalettesService } from '../../services/palettes.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { CanvasService } from '../../services/canvas.service';
import { PaletteComponent } from '../../shared/components/palette/palette.component';
import { palettes } from '../../data/palettes';

@Component({
  selector: 'sf-sidebar',
  standalone: true,
  imports: [PaletteComponent],
  template: `
    <div
      class="sidebar transition-all h-100 mr-3"
      [class.sidebar-mobile]="isMobile()"
      [class.show]="show()">
      <div class="bg-light p-3 h-100 overflow-y-auto">
        <sf-palette
          name="Colours in model"
          [colours]="usedColours()"
          [selectedColour]="selectedColour()"
          (updateColour)="clickedColour($event)">
        </sf-palette>

        <sf-palette
          name="Recent colours"
          [colours]="palettesService.recentlyUsedSignal()"
          [selectedColour]="selectedColour()"
          (updateColour)="clickedColour($event)">
        </sf-palette>

        @for (palette of customPalettes; track $index) {
          <sf-palette
            [name]="palette.name"
            [colours]="palette.colours"
            [selectedColour]="selectedColour()"
            (updateColour)="clickedColour($event)">
          </sf-palette>
        }
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

  customPalettes = palettes;

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
