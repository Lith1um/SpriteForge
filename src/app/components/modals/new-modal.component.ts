import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { Point2D } from '../../shared/models/point.interface';

@Component({
  selector: 'sf-new-modal',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  template: `
    <sl-dialog label="Create some art!" [open]="visible()" (sl-hide)="visible.set(false)">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 flex-wrap">
          @for (preset of presets; track $index) {
            <sl-button autofocus (click)="presetCanvas(preset.x, preset.y)">
              {{preset.x}}x{{preset.y}}
            </sl-button>
          }
        </div>
        <div>
          <sl-input
            #widthInput
            label="Width"
            type="number"
            [valueAsNumber]="width()" 
            [min]="minDimension"
            [max]="maxDimension"
            (sl-input)="width.set(widthInput.valueAsNumber)">
          </sl-input>
          @if (!isWidthValid()) {
            <div class="text-sm text-error font-weight-semi-bold">
              You must enter a number between {{ this.minDimension }} and {{ this.maxDimension }}.
            </div>
          }
        </div>

        <div>
          <sl-input
            #heightInput
            label="Height"
            type="number"
            [valueAsNumber]="height()" 
            [min]="minDimension"
            [max]="maxDimension"
            (sl-input)="height.set(heightInput.valueAsNumber)">
          </sl-input>
          @if (!isHeightValid()) {
            <div class="text-sm text-error font-weight-semi-bold">
              You must enter a number between {{ this.minDimension }} and {{ this.maxDimension }}.
            </div>
          }
        </div>
      </div>

      <sl-button slot="footer" (click)="visible.set(false)">
        Cancel
      </sl-button>
      <sl-button slot="footer" variant="primary" [disabled]="!isValid()" (click)="createCanvas()">
        Create
      </sl-button>
    </sl-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewModalComponent {
  
  visible = model.required<boolean>();
  
  width = model.required<number>();
  height = model.required<number>();

  startCanvas = output<void>();

  isWidthValid = computed(() => this.width() && this.validateNum(this.width()));
  isHeightValid = computed(() => this.height() && this.validateNum(this.height()));

  isValid = computed(() => this.isWidthValid() && this.isHeightValid());

  maxDimension = 256;
  minDimension = 1;

  presets: Point2D[] = [
    { x: 8, y: 8 },
    { x: 16, y: 16 },
    { x: 32, y: 32 },
    { x: 64, y: 64 },
  ];

  validateNum(val: number): boolean {
    if (val < this.minDimension || val > this.maxDimension) {
      return false;
    }
    return true;
  }

  createCanvas(): void {
    this.startCanvas.emit();
    this.visible.set(false);
  }

  presetCanvas(width: number, height: number): void {
    this.width.set(width);
    this.height.set(height);
    this.createCanvas();
  }
}
