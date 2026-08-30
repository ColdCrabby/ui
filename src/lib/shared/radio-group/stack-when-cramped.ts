import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';

// Extra px of leeway added per child to account for padding, margin, and gap
// without touching the DOM's computed styles on every resize.
const LEEWAY_PER_CHILD_PX = 16;

@Directive({
  selector: '[stackWhenCramped]',
  standalone: true,
})
export class StackWhenCramped {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private observer: ResizeObserver | null = null;
  private estimatedWidth = 0;

  constructor() {
    afterNextRender(() => {
      this.estimatedWidth = this.estimateNeededWidth();
      if (this.estimatedWidth === 0) {
        return;
      }

      const el = this.el.nativeElement;
      // Observe the container, not ourselves: toggling `.stacked` changes our
      // own width, so observing `el` would feed that back into the measurement
      // and oscillate every frame. The available inline space belongs to the
      // parent and stays put when we restack.
      this.observer = new ResizeObserver(() => this.updateLayout());
      this.observer.observe(el.parentElement ?? el);
      this.updateLayout();
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  // Estimate the natural inline width the element needs using character counts.
  // A 1ch probe gives us the advance width for the element's font without
  // triggering layout on flex children. Each child gets a flat leeway bonus
  // to cover its padding, margin, and any gap contributed by the parent.
  private estimateNeededWidth(): number {
    const el: HTMLElement = this.el.nativeElement;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) {
      return 0;
    }

    const probe = document.createElement('span');
    probe.style.cssText =
      'position:absolute;visibility:hidden;width:1ch;display:inline-block;pointer-events:none';
    el.appendChild(probe);
    const chWidth = probe.offsetWidth || 8;
    el.removeChild(probe);

    return children.reduce((sum, child) => {
      const chars = (child.textContent ?? '').trim().length;
      return sum + chars * chWidth + LEEWAY_PER_CHILD_PX;
    }, 0);
  }

  // Compare estimated needed width against the inline space the container
  // offers. Reading the parent's content box (rather than our own width) keeps
  // the decision independent of whether we are currently stacked.
  private updateLayout(): void {
    const el: HTMLElement = this.el.nativeElement;
    const available = this.availableInlineWidth();

    const shouldStack = this.estimatedWidth > available;
    const isStacked = el.classList.contains('stacked');

    if (shouldStack && !isStacked) {
      this.renderer.addClass(el, 'stacked');
    } else if (!shouldStack && isStacked) {
      this.renderer.removeClass(el, 'stacked');
    }
  }

  // Inline space the container makes available to us, minus its padding. Falls
  // back to our own width when we have no parent to measure against.
  private availableInlineWidth(): number {
    const el: HTMLElement = this.el.nativeElement;
    const parent = el.parentElement;
    if (!parent) {
      return el.offsetWidth;
    }
    const styles = getComputedStyle(parent);
    const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    return parent.clientWidth - padX;
  }
}
