import { ChangeDetectionStrategy, Component, computed, effect, inject, model, output } from '@angular/core';
import { PalettesService } from '../../services/palettes.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, startWith } from 'rxjs';

@Component({
  selector: 'sf-sidebar',
  standalone: true,
  template: `
    <div
      class="sidebar transition-all h-100 mr-3"
      [class.sidebar-mobile]="isMobile()"
      [class.show]="show()">
      <div class="bg-light p-3 rounded-2xl h-100">
        <h5>Menu</h5>
        <div>Recent colours</div>
        <div class="grid gap-1 used-colours">
          @for (colour of palettesService.recentlyUsedSignal(); track $index) {
            <div
              class="w-100 colour border-dark border-1 pointer"
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

  resize = toSignal(fromEvent(window, 'resize').pipe(startWith(false), debounceTime(10)));
  isMobile = computed(() => {
    // trigger on resize
    this.resize();
    return window.innerWidth <= 768;
  });

  show = model.required<boolean>();

  updateColour = output<string>();

}
