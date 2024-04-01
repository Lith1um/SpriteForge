import { ChangeDetectionStrategy, Component, Directive, Renderer2, contentChildren, effect, input, model, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Directive({
  selector: '[sfModalButton]',
  standalone: true,
})
export class ModalButtonDirective {}

@Component({
  selector: 'sf-modal',
  standalone: true,
  imports: [IconComponent, ModalButtonDirective],
  template: `
    @if (visible()) {
      <div 
        class="fixed inset z-10 h-100 w-100 flex backdrop items-center justify-center"
        (click)="closed.emit(); visible.set(false)">

        <div class="animate-fade-in modal flex flex-col" [style.height]="height()"  [style.width]="width()" (click)="$event.stopPropagation()">
          <div class="p-2 flex gap-2 h6 m-0 border-light border-b items-center">
            <div class="flex-1 truncate">{{ modalTitle() }}</div>
            <button class="icon-button" (click)="closed.emit(); visible.set(false)">
              <sf-icon>close</sf-icon>
            </button>
          </div>
          
          <div class="flex-1 min-h-0 overflow-y-auto">
            <div class="p-2 h-100">
              <ng-content></ng-content>
            </div>
          </div>
  
          <div class="p-2 flex gap-2 border-light border-t justify-end" [class.hidden]="buttons().length === 0">
            <ng-content select="[sfModalButton]"></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal {
      max-width: 95vw;
      max-height: 95vh;
      background-color: var(--sf-bg);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {

  buttons = contentChildren<ModalButtonDirective>(ModalButtonDirective);

  modalTitle = input.required<string>();
  height = input<string>('auto');
  width = input<string>('auto');
  visible = model.required<boolean>();

  closed = output<void>();

  private escListener: () => void;

  constructor(private renderer: Renderer2) {
    effect(() => {
      if (this.visible()) {
        this.escListener = this.renderer.listen(window, 'keydown.escape', () => this.onEsc());
      } else {
        this.escListener?.();
      }
    });
  }

  private onEsc(): void {
    this.visible.set(false);
  }
  
}
