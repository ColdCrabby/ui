import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BrowserStorage } from './browser-storage';

const THEME_KEY = 'theme';

/**
 * Owns the light / dark colour scheme for an app built on the shared design
 * language. Adding `class="dark"` to `<html>` flips every theme token via the
 * CSS cascade (see `styles/theme/_dark.scss`), so this service just toggles
 * that class and remembers the choice.
 *
 * Three states:
 * - explicit `light` / `dark` — the user picked one (persisted in localStorage);
 * - `system` — no stored choice, follow the OS `prefers-color-scheme` live.
 *
 * App-agnostic and `providedIn: 'root'`: inject it anywhere (e.g. the shared
 * {@link ThemeToggle}) and it self-applies on first construction.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(BrowserStorage);

  /** Raw string signal backed by localStorage, kept in sync across tabs. */
  private readonly storedTheme = this.storage.get(THEME_KEY, 'local');

  /** OS colour-scheme preference, kept live via a matchMedia listener. */
  private readonly systemPrefersDark = signal<boolean>(this.queryPrefersDark());

  /**
   * `true` when dark mode is active. Derives from the stored value, falling
   * back to the live OS colour-scheme preference when nothing is stored.
   */
  readonly isDarkMode = computed<boolean>(() => {
    const stored = this.storedTheme();
    if (stored !== null) {
      return stored === 'dark';
    }
    return this.systemPrefersDark();
  });

  /** True when the user has chosen an explicit theme (not "follow system"). */
  readonly hasExplicitPreference = computed<boolean>(() => this.storedTheme() !== null);

  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => this.systemPrefersDark.set(event.matches));
    }
    // Apply the theme class reactively, including cross-tab updates.
    effect(() => this.applyTheme(this.isDarkMode()));
  }

  /** Flip between explicit light and dark. */
  toggleTheme(): void {
    this.storage.write(THEME_KEY, this.isDarkMode() ? 'light' : 'dark', 'local');
  }

  /** Pin an explicit theme. */
  setTheme(isDark: boolean): void {
    this.storage.write(THEME_KEY, isDark ? 'dark' : 'light', 'local');
  }

  /** Clear the explicit choice so the UI follows the OS colour scheme. */
  useSystemTheme(): void {
    this.storage.write(THEME_KEY, null, 'local');
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.classList.toggle('dark', isDark);
  }

  private queryPrefersDark(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }
}
