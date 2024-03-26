import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { ModalButtonDirective, ModalComponent } from '../../shared/components/modal/modal.component';
import { PreviewComponent } from '../../shared/components/preview/preview.component';
import { Pixel } from '../../interfaces/pixel.interface';
import UPNG from 'upng-js';
import { SavedModel } from '../../interfaces/saved-model.model';

@Component({
  selector: 'sf-import-modal',
  standalone: true,
  imports: [ModalComponent, ModalButtonDirective, PreviewComponent],
  template: `
    @if (visible()) {
      <sf-modal
        [(visible)]="visible"
        modalTitle="Import your art!">
        <label>
          <div>Select your art file (.png)</div>
          <input type="file" accept="image/png" (input)="onFileInput($event)"/>
        </label>
        <button sfModalButton (click)="visible.set(false)">
          Cancel
        </button>
        <button sfModalButton [disabled]="!file()" (click)="importModel()">
          Import
        </button>
      </sf-modal>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportModalComponent {

  visible = model.required<boolean>();

  import = output<SavedModel>();

  file = signal<File | undefined>(undefined);

  onFileInput(e: Event): void {
    const input = <HTMLInputElement>e.target;
    this.file.set(input.files?.[0]);
  }

  async importModel(): Promise<void> {
    const file = this.file();
    if (!file || file.type !== 'image/png') {
      return;
    }

    const result = UPNG.decode(await file.arrayBuffer());

    if (result.width > 256 || result.height > 256) {
      // TODO: add message to show user informing image too large
      return;
    }

    const pixelColours = this.groupArray([...new Uint8Array(result.data)], 4).slice(0, result.width * result.height);
    
    const pixels = pixelColours.map<[number, Pixel]>((pixelColour, index) => ([
      index,
      {
        index,
        colour: pixelColour[3] === 0 ? null : this.rgbToHex(pixelColour[0], pixelColour[1], pixelColour[2]),
        row: Math.floor(index / result.width),
        col: index % result.width,
      }
    ]));
   
    this.import.emit(SavedModel.fromJson({
      canvas: pixels,
      width: result.width,
      height: result.height,
      filename: file.name,
    }));
    this.file.set(undefined);
    this.visible.set(false);
  }

  private groupArray(arr: any[], size: number): any[][] {
    const group: any[] = [];
    for (let i = 0, j = 0; i < arr.length; i++) {
      if (i >= size && i % size === 0) {
        j++;
      }
      group[j] = group[j] || [];
      group[j].push(arr[i])
    }
    return group;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const componentToHex = (c: number) => {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

}
