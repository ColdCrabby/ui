import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Showcase } from './showcase/showcase';

/**
 * Dev-harness shell: a thin frame around the component showcase with a
 * light/dark toggle so the design language can be exercised in isolation.
 */
@Component({
  selector: 'cc-root',
  standalone: true,
  imports: [Showcase],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  protected readonly dark = signal(this.document.documentElement.classList.contains('dark'));

  protected toggleTheme(): void {
    const next = !this.dark();
    this.dark.set(next);
    this.document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('cc-ui-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore persistence failures */
    }
  }
}
