import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, effect, inject, model, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { CanvasService } from '../../services/canvas.service';
import { AnimationComponent } from '../../shared/components/animation/animation.component';

@Component({
  selector: 'sf-sidebar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [AnimationComponent],
  template: `
    <div
      class="sidebar transition-all h-100 mr-3 rounded-xl"
      [class.sidebar-mobile]="isMobile()"
      [class.show]="show()">
      <div class="bg-light p-3 h-100 overflow-y-auto rounded-xl">

        <div class="flex flex-col gap-2">
          <sl-button style="width: 100%;" (click)="newFile.emit()">
            <sl-icon slot="prefix" name="file-earmark-plus"></sl-icon>
            New File
          </sl-button>
  
          <sl-button style="width: 100%;" (click)="saveFile.emit()" [disabled]="!canvasService.state.started()">
            <sl-icon slot="prefix" name="floppy"></sl-icon>
            Save File
          </sl-button>
  
          <sl-button style="width: 100%;" (click)="openFile.emit()">
            <sl-icon slot="prefix" name="folder2-open"></sl-icon>
            Open File
          </sl-button>
  
          <sl-button style="width: 100%;" (click)="exportFile.emit()" [disabled]="!canvasService.state.started()">
            <sl-icon slot="prefix" name="file-earmark-arrow-down"></sl-icon>
            Export (.png)
          </sl-button>
          
          <!-- <sl-button style="width: 100%;" (click)="canvasService.addFrame()">
            <sl-icon slot="prefix" name="layers-half"></sl-icon>
            Add frame
          </sl-button>
  
          @if (canvasService.state.animationFrames()) {
            <sf-animation
              [frames]="canvasService.state.animationFrames()"
              [width]="canvasService.state.width()"
              [height]="canvasService.state.height()">
            </sf-animation>
          } -->
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
        transform: translateX(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  canvasService = inject(CanvasService);

  newFile = output<void>();
  openFile = output<void>();
  saveFile = output<void>();
  exportFile = output<void>();

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
