import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { ModalButtonDirective, ModalComponent } from '../../shared/components/modal/modal.component';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { SaveLoadService } from '../../services/save-load.service';
import { SavedModel } from '../../interfaces/saved-model.model';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'sf-load-modal',
  standalone: true,
  imports: [ModalComponent, ModalButtonDirective, PreviewComponent, KeyValuePipe],
  template: `
    @if (visible()) {
      <sf-modal
        [(visible)]="visible"
        modalTitle="Load a model!">

        @for (savedModel of saveLoadService.savedModelsSignal(); track savedModel.filename) {
          <div class="pointer bg-light card w-100 flex gap-2 p-2 rounded-md mb-2" (click)="loadModel(savedModel)">
            <sf-preview
              style="width: 100px"
              [pixels]="savedModel.canvas"
              [width]="savedModel.width"
              [height]="savedModel.height">
            </sf-preview>

            <div class="flex-1">
              <h6>{{ savedModel.filename }}</h6>
            </div>
          </div>
        }
      </sf-modal>
    }
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

  loadModel(model: SavedModel): void {
    this.load.emit(model);
    this.visible.set(false);
  }

}
