import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { Pixel } from '../../../interfaces/pixel.interface';
import { pixelsToPng } from '../../helpers/canvas';

@Component({
  selector: 'sf-animation',
  standalone: true,
  template: `
    <canvas #canvas class="hidden" [height]="height()" [width]="width()"></canvas>
    @if (currentImage()) {
      <img [src]="currentImage()" class="animation-image h-100 w-100"/>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .animation-image {
      object-fit: contain;
      image-rendering: pixelated;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationComponent {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  frames = input.required<Map<number, Pixel>[]>();
  width = input.required<number>();
  height = input.required<number>();

  images = computed(() => this.frames().map(frame =>
    pixelsToPng(this.canvas().nativeElement, frame)));

  currentIndex = signal<number>(0);
  currentImage = computed(() => this.images()[this.currentIndex()]);

  constructor() {
    setInterval(() => {
      const index = this.currentIndex() < this.images().length - 1
        ? this.currentIndex() + 1
        : 0;
      this.currentIndex.set(index);
    }, 500);
  }
}