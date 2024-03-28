import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { ModalButtonDirective, ModalComponent } from '../../shared/components/modal/modal.component';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { Pixel } from '../../interfaces/pixel.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sf-export-modal',
  standalone: true,
  imports: [ModalComponent, ModalButtonDirective, PreviewComponent, FormsModule],
  template: `
    @if (visible()) {
      <sf-modal
        [(visible)]="visible"
        modalTitle="Export your file!">
        <label>
          <div>Give it a name</div>
          <input type="text" [(ngModel)]="filename"/>
        </label>
        <div>Preview of export:</div>
        <sf-preview
          style="width: 300px"
          [pixels]="canvas()"
          [width]="width()"
          [height]="height()"
          (image)="image.set($event)">
        </sf-preview>
        <button sfModalButton (click)="visible.set(false)">
          Cancel
        </button>
        <button sfModalButton [disabled]="!filename()" (click)="exportModel()">
          Export
        </button>
      </sf-modal>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportModalComponent {

  visible = model.required<boolean>();

  height = input.required<number>();
  width = input.required<number>();
  canvas = input.required<Map<number, Pixel>>();

  filename = signal<string | undefined>(undefined);
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
    
    this.filename.set(undefined);
    this.image.set(undefined);
    this.visible.set(false);
  }

}
