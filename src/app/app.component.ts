import { Component } from '@angular/core';
import { IconComponent } from './shared/components/icon/icon.component';

@Component({
  selector: 'app-root',
  imports: [IconComponent],
  standalone: true,
  template: `
    <div>
      <sf-icon>home</sf-icon> SpriteForge!
    </div>
  `,
})
export class AppComponent {
  title = 'sprite-forge';
}
