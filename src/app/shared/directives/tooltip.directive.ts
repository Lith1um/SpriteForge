import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, HostListener, ViewContainerRef, input } from '@angular/core';
import { TooltipPosition } from '../models/tooltip-position.type';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';

@Directive({
  selector: '[sfTooltip]',
  standalone: true,
})
export class TooltipDirective {

  tooltipText = input.required<string>();
  tooltipPosition = input<TooltipPosition>('top');
  tooltipShowMs = input<number>(150);
  tooltipHideMs = input<number>(150);

  private tooltipRef: ComponentRef<TooltipComponent> | undefined;
  private showTimeout?: number;
  private hideTimeout?: number;

  @HostListener('mouseenter')
  onMouseenter(): void {
    this.create();
  }

  @HostListener('mouseleave')
  @HostListener('touchend')
  onMouseleave(): void {
    this.setTooltipHideTimeout();
  }

  constructor(
    private host: ElementRef,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef) {}

  private create(): void {
    if (this.tooltipRef) {
      this.destroy();
    }
    this.tooltipRef = this.viewContainerRef.createComponent(TooltipComponent);
    this.tooltipRef.setInput('tooltipText', this.tooltipText());
    this.cdr.detectChanges();

    this.showTimeout = window.setTimeout(() => this.tooltipRef?.instance.visible.set(true), this.tooltipShowMs());

    computePosition(this.host.nativeElement, this.tooltipRef.instance.host.nativeElement, {
      placement: this.tooltipPosition(),
      middleware: [
        offset(12),
        flip(),
        shift({padding: 16}),
        arrow({element: this.tooltipRef.instance.arrowRef().nativeElement}),
      ],
    }).then(({x, y, placement, middlewareData}) => {
      if (!this.tooltipRef) {
        return;
      }

      Object.assign(this.tooltipRef.instance.host.nativeElement.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      if (middlewareData.arrow) {
        const {x: arrowX, y: arrowY} = middlewareData.arrow;
      
        const staticSide = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]];
      
        Object.assign(this.tooltipRef.instance.arrowRef().nativeElement.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide as string]: '-0.2rem',
        });
      }
    });
  }

  private setTooltipHideTimeout() {
    this.hideTimeout = window.setTimeout(() => this.destroy(), this.tooltipHideMs());
  }

  private destroy(): void {
    if (this.tooltipRef) {
      window.clearInterval(this.showTimeout);
      window.clearInterval(this.hideTimeout);
      this.tooltipRef.destroy();
      this.tooltipRef = undefined;
    }
  }

}