# @coldcrabby/ui

Shared frontend UI for Cold Crabby apps: the **SCSS design language** (graphite +
molten-amber accent, `--accent`-derived tokens, `html.dark` mode) and the
**app-agnostic Angular presentational primitives** (button, select, switch,
slider, color-picker, …).

It is consumed as **source** — no dist build, no npm release. Consumers vendor an
always-latest, git-ignored checkout of `main` and wire it through a tsconfig path
(→ the `public-api.ts` barrel) and a Sass `includePaths` entry (→ the design
language). This mirrors how `cloud-presets` already consumes its in-repo
`packages/ui`.

## What lives here (and what does not)

Only presentational, domain-neutral pieces. Anything app-specific — 3D-canvas
panels, `components/*`, notification/dialog services, the viewport-locking reset
— stays in its own app. The slicer is the style origin; its design language was
lifted here verbatim and the slicer becomes a consumer.

```
src/
  public-api.ts          # barrel: the one import surface for primitives
  styles/                # the design language (global SCSS)
    index.scss           # entry point — pull in once from an app's root stylesheet
    theme/               # root + light + dark CSS variables, SCSS tokens
    base/                # scrolling-app reset, focus, typography, forms, scrollbar, floating
    utilities/           # utility classes
    _mixins.scss         # transition, focus-ring, text-ellipsis, drop-aurora, …
  lib/
    ui/                  # primitives (button, select, switch, slider, color-picker, …)
    shared/              # building blocks (icon, floating, tooltip, radio-group, badge, input-modality)
dev/                     # local dev harness (a reference consumer — see below)
```

### Primitives (via `@coldcrabby/ui`)

`Button` · `IconButton` · `SectionHeader` · `EmptyState` · `Switch` · `Slider` ·
`RangeSlider` · `NumberInput` · `Select` · `RadioGroup` · `Segmented` ·
`ColorPicker` · `InlineNotice` · `FieldRow` · `ModalShell` · `WizardShell` ·
`Icon` · `Badge` · `TooltipDirective` · `FloatingService` · `RadioGroupDirective`
· `RadioButtonValue` · `StackWhenCramped` · `UserInputModality`.

## Consuming it

A consumer needs three things. (`<checkout>` is wherever the app vendors this
repo — a git-ignored path.)

1. **tsconfig path → the barrel:**

   ```jsonc
   // tsconfig.json → compilerOptions.paths
   "@coldcrabby/ui": ["<checkout>/src/public-api.ts"]
   ```

2. **Sass `includePaths` → the design language**, then import it once from the
   app's root stylesheet:

   ```jsonc
   // angular.json → architect.build.options
   "stylePreprocessorOptions": { "includePaths": ["<checkout>/src/styles"] }
   ```

   ```scss
   // the app's global styles.scss
   @use 'index'; // resolves to <checkout>/src/styles/index.scss
   ```

3. **Runtime peers** the primitives need: `provideHttpClient()` (the `Icon`
   component fetches its SVGs), `provideMarkdown()` from `ngx-markdown` (block
   tooltips), and the `iconoir` SVGs served under `/assets/icons` (and
   `/assets/icons/solid`). See `angular.json` here for the exact asset globs.

Then:

```ts
import { Button, Select } from '@coldcrabby/ui';
```

```html
<button nexusButton variant="primary">Slice now</button>
```

Dark mode is opt-in per document: add `class="dark"` to `<html>`; every token
flips through the CSS cascade with no JavaScript reparse.

## Local development

`dev/` is a minimal Angular app that renders a live component gallery. It is
deliberately wired as a **reference consumer** — it imports primitives from
`@coldcrabby/ui` and pulls the design language via `includePaths`, exactly as a
real app does — so if the lab builds, the integration contract holds.

```bash
pnpm install
pnpm dev        # → http://localhost:4300
```

## Releases

None. Track `main`; consumers vendor an always-latest checkout. Fixes push
straight to `main`.
