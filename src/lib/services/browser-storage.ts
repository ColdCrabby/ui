import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export type StorageArea = 'local' | 'session';

/**
 * Reactive, type-safe access to `localStorage` / `sessionStorage`.
 *
 * - Returns writable `Signal`s that stay in sync with the underlying entry.
 * - `local` signals are kept in sync across tabs via the `storage` event;
 *   `session` signals are tab-local by nature and are NOT cross-tab synced.
 * - Signals are cached by key, so repeated `get()` calls return the same one.
 *
 * App-agnostic: no product-specific keys live here. Lives in the shared UI so
 * services like {@link ThemeService} have one storage primitive to build on.
 */
@Injectable({ providedIn: 'root' })
export class BrowserStorage {
  private readonly localSignals = new Map<string, ReturnType<typeof signal<string | null>>>();
  private readonly sessionSignals = new Map<string, ReturnType<typeof signal<string | null>>>();

  constructor() {
    const destroyRef = inject(DestroyRef);
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event) => event.storageArea === localStorage && event.key !== null),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe((event) => {
        if (event.key === null) {
          return;
        }
        const existing = this.localSignals.get(event.key);
        if (existing) {
          existing.set(event.newValue);
        }
      });
  }

  /** Returns a writable `Signal<string | null>` backed by the given key. */
  get(key: string, area: StorageArea = 'local'): ReturnType<typeof signal<string | null>> {
    const map = area === 'local' ? this.localSignals : this.sessionSignals;

    const existing = map.get(key);
    if (existing) {
      return existing;
    }

    const storage = this.storageFor(area);
    const initial = storage ? storage.getItem(key) : null;
    const created = signal<string | null>(initial);
    map.set(key, created);
    return created;
  }

  /** Writes `value` to the signal AND the underlying storage in one step. */
  write(key: string, value: string | null, area: StorageArea = 'local'): void {
    const s = this.get(key, area);
    const storage = this.storageFor(area);

    if (storage) {
      if (value === null) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, value);
      }
    }

    s.set(value);
  }

  /** Reads a JSON-serialised value; returns `null` when absent or unparseable. */
  getJson<T>(key: string, area: StorageArea = 'local'): T | null {
    const raw = this.get(key, area)();
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /** Writes a value as JSON to storage. */
  writeJson<T>(key: string, value: T, area: StorageArea = 'local'): void {
    this.write(key, JSON.stringify(value), area);
  }

  private storageFor(area: StorageArea): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return area === 'local' ? window.localStorage : window.sessionStorage;
  }
}
