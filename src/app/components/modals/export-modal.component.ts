import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { Pixel } from '../../interfaces/pixel.interface';

@Component({
  selector: 'sf-export-modal',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [PreviewComponent],
  template: `
    <sl-dialog label="Export your file!" [open]="visible()" (sl-hide)="visible.set(false)">
      <div class="flex flex-col gap-2">
        <sl-input
          #input
          label="Give it a name"
          type="text"
          [value]="filename()"
          (sl-input)="filename.set(input.value)">
        </sl-input>
  
        <div>Preview of export:</div>
        <sf-preview
          [pixels]="canvas()"
          [width]="width()"
          [height]="height()"
          (image)="image.set($event)">
        </sf-preview>
      </div>

      <sl-button slot="footer" (click)="visible.set(false)">
        Cancel
      </sl-button>
      <sl-button slot="footer" variant="primary" [disabled]="!filename()" (click)="exportModel()">
        Export
      </sl-button>
    </sl-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportModalComponent {

  visible = model.required<boolean>();

  height = input.required<number>();
  width = input.required<number>();
  canvas = input.required<Map<number, Pixel>>();

  filename = signal<string | null>(null);
  image = signal<string | undefined>(undefined);

  exportModel(): void {
    const filename = this.filename();
    const image = this.image();
    if (!filename || !image) {
      return;
    }

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = image;
    // the filename you want
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    this.filename.set(null);
    this.image.set(undefined);
    this.visible.set(false);
  }

}
