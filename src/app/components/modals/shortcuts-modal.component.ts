import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalButtonDirective, ModalComponent } from '../../shared/components/modal/modal.component';
import { Point2D } from '../../shared/models/point.interface';
import { SnippetComponent } from '../../shared/components/snippet/snippet.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'sf-shortcuts-modal',
  standalone: true,
  imports: [ModalComponent, SnippetComponent, IconComponent],
  template: `
    @if (visible()) {
      <sf-modal
        [(visible)]="visible"
        width="300px"
        modalTitle="Shortcuts">

        <div class="flex flex-col gap-2">
          <div class="flex w-100">
            <div class="flex-1">
              New
            </div>

            <div>
              <sf-snippet>
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
                <sf-icon>keyboard_command_key</sf-icon>&nbsp;/ ctrl
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
      </sf-modal>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortcutsModalComponent {
  visible = model.required<boolean>();
}
