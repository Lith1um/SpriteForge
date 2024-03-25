import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, output, viewChild } from '@angular/core';
import { Pixel } from '../../../interfaces/pixel.interface';
import { pixelsToPng } from '../../helpers/canvas';

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

  image = output<string>();

  constructor() {
    effect(() => {
      const img = this.previewImg();
      if (!img) {
        return;
      }
      this.image.emit(img);
    });
  }

  previewImg = computed(() => pixelsToPng(this.canvas().nativeElement, this.pixels()));
}
