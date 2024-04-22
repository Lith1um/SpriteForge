import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { Pixel } from '../../interfaces/pixel.interface';
import { AnimationComponent } from '../../shared/components/animation/animation.component';

@Component({
  selector: 'sf-save-modal',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [AnimationComponent, PreviewComponent],
  template: `
    <sl-dialog label="Save your art!" [open]="visible()" (sl-hide)="visible.set(false)">
      <div class="flex flex-col gap-2">
        <sl-input
          #input
          label="Give it a name"
          type="text"
          [value]="filename()"
          (sl-input)="filename.set(input.value)">
        </sl-input>
  
        <div>Preview of current art:</div>
        @if (frames().length) {
          <sf-animation
            [frames]="frames()"
            [width]="width()"
            [height]="height()">
          </sf-animation>
        } @else {
          <sf-preview
            [pixels]="canvas()"
            [width]="width()"
            [height]="height()">
          </sf-preview>
        }
      </div>

      <sl-button slot="footer" (click)="visible.set(false)">
        Cancel
      </sl-button>
      <sl-button slot="footer" variant="primary" [disabled]="!filename()" (click)="saveModel()">
        Save
      </sl-button>
    </sl-dialog>
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
