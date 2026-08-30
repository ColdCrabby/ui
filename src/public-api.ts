/**
 * Cold Crabby UI — public API barrel.
 *
 * Consumers map a tsconfig path (e.g. `@coldcrabby/ui`) to this file and import
 * primitives as source. Everything exported here is presentational and
 * app-agnostic; app-specific pieces stay in their own repos.
 */

// --- Primitives ------------------------------------------------------------
export { Button } from './lib/ui/button/button';
export type { ButtonSize, ButtonVariant } from './lib/ui/button/button';
export { IconButton } from './lib/ui/icon-button/icon-button';
export type { IconButtonSize, IconButtonVariant } from './lib/ui/icon-button/icon-button';
export { SectionHeader } from './lib/ui/section-header/section-header';
export { EmptyState } from './lib/ui/empty-state/empty-state';
export { Switch } from './lib/ui/switch/switch';
export type { SwitchSize } from './lib/ui/switch/switch';
export { Slider } from './lib/ui/slider/slider';
export { RangeSlider } from './lib/ui/range-slider/range-slider';
export { NumberInput } from './lib/ui/number-input/number-input';
export { Select } from './lib/ui/select/select';
export type { SelectOption } from './lib/ui/select/select';
export { RadioGroup } from './lib/ui/radio-group/radio-group';
export type { RadioOption } from './lib/ui/radio-group/radio-group';
export { Segmented } from './lib/ui/segmented/segmented';
export type { SegmentOption } from './lib/ui/segmented/segmented';
export { ColorPicker } from './lib/ui/color-picker/color-picker';
export { InlineNotice } from './lib/ui/inline-notice/inline-notice';
export type { InlineNoticeTone } from './lib/ui/inline-notice/inline-notice';
export { FieldRow } from './lib/ui/field-row/field-row';
export { ModalShell } from './lib/ui/modal-shell/modal-shell';
export { WizardShell } from './lib/ui/wizard/wizard-shell';

// --- Core app services -----------------------------------------------------
// App-agnostic services every consumer needs. Presentational primitives above
// stay stateless; these own cross-cutting concerns (persisted preferences,
// colour scheme) so each app does not re-implement them.
export { BrowserStorage } from './lib/services/browser-storage';
export type { StorageArea } from './lib/services/browser-storage';
export { ThemeService } from './lib/services/theme';

// --- Shared presentational building blocks ---------------------------------
export { Icon } from './lib/shared/icon/icon';
export { IconCache } from './lib/shared/icon/icon-cache';
export { Badge } from './lib/shared/badge/badge';
export type { BadgeVariant } from './lib/shared/badge/badge';
export { TooltipDirective } from './lib/shared/tooltip/tooltip.directive';
export { UserInputModality } from './lib/shared/input-modality/input-modality';

// The shared radio behaviour is a set of host directives; the ui `RadioGroup`
// above is the styled `<nexus-radio-group>` component. Alias to avoid a clash.
export { RadioGroup as RadioGroupDirective } from './lib/shared/radio-group/radio-group';
export { RadioButtonValue } from './lib/shared/radio-group/radio-button-value';
export { StackWhenCramped } from './lib/shared/radio-group/stack-when-cramped';

// --- Floating (positioning) service ----------------------------------------
export { FloatingService, FloatingRef, FloatingComponentRef } from './lib/shared/floating';
export { applyFloating } from './lib/shared/floating';
export type {
  FloatingConfig,
  FloatingOptions,
  FloatingPlacement,
  FloatingReference,
} from './lib/shared/floating';
