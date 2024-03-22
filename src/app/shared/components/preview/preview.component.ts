import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, viewChild } from '@angular/core';
import { Pixel } from '../../../interfaces/pixel.interface';

@Component({
  selector: 'sf-preview',
  standalone: true,
  template: `
    <canvas #canvas class="hidden" [height]="height()" [width]="width()"></canvas>
    <img [src]="previewImg()" class="preview-image h-100 w-100" style="object-fit: contain;" />
  `,
  styles: [`
    :host {
      display: block;
    }

    .preview-image {
      object-fit: contain;
      image-rendering: pixelated;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  pixels = input.required<Map<number, Pixel>>();
  width = input.required<number>();
  height = input.required<number>();

  previewImg = computed(() => {
    const context = this.canvas().nativeElement.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, this.canvas().nativeElement.width, this.canvas().nativeElement.height);

    const pixelSize = 1;

    this.pixels().forEach(pixel => {
      const row = Math.floor(pixel.index / this.width());
      const col = pixel.index % this.width();

      if (!pixel.colour) {
        return;
      }

      context.fillStyle = pixel.colour;
      context.fillRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
    });

    return this.canvas().nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream")
  });
}
