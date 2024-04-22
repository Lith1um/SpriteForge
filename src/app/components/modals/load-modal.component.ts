import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { SaveLoadService } from '../../services/save-load.service';
import { SavedModel } from '../../interfaces/saved-model.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { NumberSortPipe } from '../../shared/pipes/number-sort.pipe';
import { AnimationComponent } from '../../shared/components/animation/animation.component';

@Component({
  selector: 'sf-load-modal',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    PreviewComponent,
    AnimationComponent,
    IconComponent,
    TimeAgoPipe,
    NumberSortPipe
  ],
  template: `
    <sl-dialog label="Load a model!" [open]="visible()" (sl-hide)="visible.set(false)">
      @for (savedModel of saveLoadService.savedModelsSignal() | numSort : 'timestamp'; track savedModel.filename) {
        <div class="pointer bg-light card w-100 flex gap-3 p-2 mb-2" (click)="loadModel(savedModel)">
          @if (savedModel.frames.length) {
            <sf-animation
              style="width: 100px"
              [frames]="savedModel.frames"
              [width]="savedModel.width"
              [height]="savedModel.height">
            </sf-animation>
          } @else {
            <sf-preview
              style="width: 100px"
              [pixels]="savedModel.canvas"
              [width]="savedModel.width"
              [height]="savedModel.height">
            </sf-preview>
          }
  
          <div class="flex-1">
            <h6 class="m-0">{{ savedModel.filename }}</h6>
            Last saved: {{ savedModel.timestamp | timeAgo }}
            <button class="icon-button" (click)="deleteModel.emit(savedModel.filename)">
              <sf-icon>delete</sf-icon>
            </button>
          </div>
        </div>
      } @empty {
        <div class="flex items-center justify-center h-100">
          No saved models found
        </div>
      }
    </sl-dialog>
  `,
  styles: [`
    .card:last-child {
      margin-bottom: 0 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadModalComponent {

  saveLoadService = inject(SaveLoadService);

  visible = model.required<boolean>();

  load = output<SavedModel>();
  deleteModel = output<string>();

  loadModel(model: SavedModel): void {
    this.load.emit(model);
    this.visible.set(false);
  }

}
