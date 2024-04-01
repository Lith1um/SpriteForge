import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { ModalButtonDirective, ModalComponent } from '../../shared/components/modal/modal.component';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { Pixel } from '../../interfaces/pixel.interface';
import { FormsModule } from '@angular/forms';
import { AnimationComponent } from '../../shared/components/animation/animation.component';

@Component({
  selector: 'sf-save-modal',
  standalone: true,
  imports: [ModalComponent, ModalButtonDirective, AnimationComponent, PreviewComponent, FormsModule],
  template: `
    @if (visible()) {
      <sf-modal
        [(visible)]="visible"
        modalTitle="Save your art!">
        <label>
          <div>Give it a name</div>
          <input type="text" [(ngModel)]="filename"/>
        </label>
        <div>Preview of current art:</div>
        @if (frames().length) {
          <sf-animation
            style="width: 300px"
            [frames]="frames()"
            [width]="width()"
            [height]="height()">
          </sf-animation>
        } @else {
          <sf-preview
            style="width: 300px"
            [pixels]="canvas()"
            [width]="width()"
            [height]="height()">
          </sf-preview>
        }
        <button sfModalButton (click)="visible.set(false)">
          Cancel
        </button>
        <button sfModalButton [disabled]="!filename()" (click)="saveModel()">
          Save
        </button>
      </sf-modal>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveModalComponent {

  visible = model.required<boolean>();

  height = input.required<number>();
  width = input.required<number>();
  canvas = input.required<Map<number, Pixel>>();
  frames = input.required<Map<number, Pixel>[]>();

  save = output<string>();

  filename = signal<string | null>(null);

  saveModel(): void {
    const filename = this.filename();
    if (!filename) {
      return;
    }
    this.save.emit(filename);
    this.filename.set(null);
  }

}
