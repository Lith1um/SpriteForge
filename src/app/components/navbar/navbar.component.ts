import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'sf-navbar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  template: `
    <div class="bg-light p-2 m-3 flex flex-wrap gap-2 items-center rounded-2xl">
      <sl-button variant="default" circle (click)="toggleMenu.emit()">
        <sl-icon name="list"></sl-icon>
      </sl-button>

      <sl-tooltip content="Shortcuts">
        <sl-button variant="default" circle (click)="showShortcuts.emit()">
          <sl-icon name="command"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <div class="flex-1 text-lg font-weight-bold">
        SpriteForge
      </div>

      <sl-tooltip content="Toggle light mode">
        <sl-button variant="default" circle (click)="darkModeService.toggleDarkMode(!darkModeService.darkModeSignal())">
          <sl-icon name="{{ darkModeService.darkModeSignal() ? 'moon' : 'sun' }}"></sl-icon>
        </sl-button>
      </sl-tooltip>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  darkModeService = inject(DarkModeService);

  toggleMenu = output<void>();
  showShortcuts = output<void>();

  constructor() {
    effect(() => {
      const darkMode = this.darkModeService.darkModeSignal();

      if (darkMode) {
        document.body.classList.add('sl-theme-dark');
      } else {
        document.body.classList.remove('sl-theme-dark');
      }
    })
  }

}
