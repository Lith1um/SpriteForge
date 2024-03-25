import { ChangeDetectionStrategy, Component, computed, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalButtonDirective, ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'sf-new-modal',
  standalone: true,
  imports: [ModalComponent, ModalButtonDirective, FormsModule],
  template: `
    @if (visible()) {
      <sf-modal
        [(visible)]="visible"
        modalTitle="Create some art!">

        <div class="flex flex-col gap-2">
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
        </div>

        <button sfModalButton (click)="visible.set(false)">
          Cancel
        </button>
        <button sfModalButton [disabled]="!isValid()" (click)="createCanvas()">
          Create
        </button>
      </sf-modal>
    }
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

  maxDimension = 128;
  minDimension = 1;

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
}
