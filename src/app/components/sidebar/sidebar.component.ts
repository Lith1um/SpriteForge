import { ChangeDetectionStrategy, Component, computed, effect, inject, model } from '@angular/core';
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

        <h6>Menu</h6>

        <button (click)="canvasService.addFrame()">
          Add frame
        </button>

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
        transform: translateX(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  canvasService = inject(CanvasService);

  resize = toSignal(fromEvent(window, 'resize').pipe(startWith(false), debounceTime(10)));
  isMobile = computed(() => {
    // trigger on resize
    this.resize();
    return window.innerWidth <= 768;
  });

  show = model.required<boolean>();

  constructor() {
    effect(() => {
      if (this.isMobile()) {
        this.show.set(false);
      }
    }, {allowSignalWrites: true});
  }

}
