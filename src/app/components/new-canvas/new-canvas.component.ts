import { ChangeDetectionStrategy, Component, computed, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sf-new-canvas',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="h-100 flex items-center">
      <div class="container bg-light p-4 rounded-2xl flex flex-col gap-2 justify-center">
        <label>
          <div>Width</div>
          <input
            class="w-100"
            type="number"
            [min]="minDimension"
            [max]="maxDimension"
            [(ngModel)]="width"/>
          @if (!isWidthValid()) {
            <div class="text-sm text-error font-weight-semi-bold">
              You must enter a number between {{ this.minDimension }} and {{ this.maxDimension }}.
            </div>
          }
          <div></div>
        </label>
        <label>
          <div>Height</div>
          <input
            class="w-100"
            type="number"
            [min]="minDimension"
            [max]="maxDimension"
            [(ngModel)]="height"/>
          @if (!isHeightValid()) {
            <div class="text-sm text-error font-weight-semi-bold">
              You must enter a number between {{ this.minDimension }} and {{ this.maxDimension }}.
            </div>
          }
        </label>
  
        <button [disabled]="!isValid()" (click)="startCanvas.emit()">
          Start painting
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 100%;
      width: 300px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCanvasComponent {
  startCanvas = output<void>();

  width = model.required<number>();
  height = model.required<number>();

  isWidthValid = computed(() => this.width() && this.validateNum(this.width()));
  isHeightValid = computed(() => this.height() && this.validateNum(this.height()));

  isValid = computed(() => this.isWidthValid() && this.isHeightValid());

  maxDimension = 128;
  minDimension = 1;

  validateNum(val: number): boolean {
    if (val < this.minDimension || val > this.maxDimension) {
      return false;
    }
    return true;
  }
}
