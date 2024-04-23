import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { PalettesService } from '../../services/palettes.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { CanvasService } from '../../services/canvas.service';
import { PaletteComponent } from '../../shared/components/palette/palette.component';
import { palettes } from '../../data/palettes';
import { debounce } from '../../shared/helpers/debounce';
import { StringSortPipe } from '../../shared/pipes/string-sort.pipe';

@Component({
  selector: 'sf-palette-bar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [PaletteComponent, StringSortPipe],
  template: `
    <div
      class="sidebar transition-all h-100 ml-3 rounded-2xl"
      [class.sidebar-mobile]="isMobile()"
      [class.show]="show()">
      <div class="bg-light p-3 h-100 overflow-y-auto rounded-2xl">

        <sf-palette
          name="Colours in model"
          [colours]="usedColours() | stringSort"
          [selectedColour]="selectedColour()"
          (updateColour)="clickedColour($event)">
        </sf-palette>

        <h6>New colour</h6>
        <sl-color-picker
          inline
          [noFormatToggle]="true"
          class="mb-4 w-100"
          style="--grid-width: 100%;"
          (sl-input)="onInput($event)">
        </sl-color-picker>

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
      margin-right: calc(-300px - 1rem);

      &.show {
        margin-right: 0;
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
        transform: translateX(calc(-100% - 1rem));
      }
    }

    input[type=color] {
      height: 50px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteBarComponent {
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
    const frames = this.canvasService.state.animationFrames();
    const usedColours = new Set<string>();

    canvas.forEach(pixel => pixel.colour && usedColours.add(pixel.colour));
    frames.forEach(frame => frame.forEach(pixel => pixel.colour && usedColours.add(pixel.colour)));
    return Array.from(usedColours);
  });

  show = model.required<boolean>();

  updateColour = output<string>();

  customPalettes = palettes;

  debounceColor = debounce((colour: string) => this.updateColour.emit(colour), 50);

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

  onInput(e: Event): void {
    this.debounceColor((<HTMLInputElement>e.target).value);
  }

}
