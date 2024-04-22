import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, model } from '@angular/core';
import { SnippetComponent } from '../../shared/components/snippet/snippet.component';

@Component({
  selector: 'sf-shortcuts-modal',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [SnippetComponent],
  template: `
    <sl-dialog label="Shortcuts" [open]="visible()" (sl-hide)="visible.set(false)">
      <div class="flex flex-col gap-2">
        <div class="flex w-100">
          <div class="flex-1">
            New
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command">keyboard_command_key</sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>n</sf-snippet>
          </div>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Save
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command"></sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>s</sf-snippet>
          </div>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Save As
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command"></sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>shift</sf-snippet>
            +
            <sf-snippet>s</sf-snippet>
          </div>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Open
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command"></sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>o</sf-snippet>
          </div>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Undo
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command"></sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>z</sf-snippet>
          </div>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Redo
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command"></sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>shift</sf-snippet>
            +
            <sf-snippet>z</sf-snippet>
          </div>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Export
          </div>
  
          <div>
            <sf-snippet>
              <sl-icon name="command"></sl-icon>&nbsp;/ ctrl
            </sf-snippet>
            +
            <sf-snippet>e</sf-snippet>
          </div>
        </div>
  
        <div class="border-dark border-b"></div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Draw tool
          </div>
  
          <sf-snippet>d</sf-snippet>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Line tool
          </div>
  
          <sf-snippet>l</sf-snippet>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Eraser
          </div>
  
          <sf-snippet>e</sf-snippet>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Rectangle tool
          </div>
  
          <sf-snippet>r</sf-snippet>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Ellipse tool
          </div>
  
          <sf-snippet>c</sf-snippet>
        </div>
  
        <div class="flex w-100">
          <div class="flex-1">
            Fill tool
          </div>
  
          <sf-snippet>f</sf-snippet>
        </div>
      </div>
    </sl-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortcutsModalComponent {
  visible = model.required<boolean>();
}
