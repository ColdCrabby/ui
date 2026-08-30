import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  Badge,
  Button,
  ColorPicker,
  EmptyState,
  Icon,
  IconButton,
  InlineNotice,
  NumberInput,
  RadioButtonValue,
  RadioGroup,
  RadioGroupDirective,
  RangeSlider,
  SectionHeader,
  Segmented,
  Select,
  Slider,
  StackWhenCramped,
  Switch,
  TooltipDirective,
} from '@coldcrabby/ui';
import type { RadioOption, SegmentOption, SelectOption } from '@coldcrabby/ui';

/**
 * Live gallery for the app-agnostic Cold Crabby primitives, lifted from the
 * slicer's component lab and trimmed to the pieces this repo ships.
 */
@Component({
  selector: 'cc-showcase',
  standalone: true,
  imports: [
    SectionHeader,
    Button,
    IconButton,
    EmptyState,
    Badge,
    Icon,
    TooltipDirective,
    RadioGroupDirective,
    RadioButtonValue,
    StackWhenCramped,
    Switch,
    Slider,
    RangeSlider,
    NumberInput,
    Select,
    RadioGroup,
    Segmented,
    ColorPicker,
    InlineNotice,
  ],
  templateUrl: './showcase.html',
  styleUrl: './showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Showcase {
  protected readonly supportsOn = signal(true);
  protected readonly spiralOn = signal(false);
  protected readonly ironingOn = signal(false);
  protected readonly density = signal(20);
  protected readonly speed = signal(120);
  protected readonly tempLow = signal(190);
  protected readonly tempHigh = signal(230);
  protected readonly layerRange = signal<[number, number]>([12, 84]);
  protected readonly layerHeight = signal(0.2);
  protected readonly wallCount = signal(3);
  protected readonly pattern = signal('grid');
  protected readonly wallGenerator = signal('arachne');
  protected readonly qualityMode = signal('balanced');
  protected readonly filamentColor = signal('#e0730f');

  protected readonly qualityOptions: readonly SegmentOption[] = [
    { value: 'draft', label: 'Draft', description: 'Fast, coarse layers' },
    { value: 'balanced', label: 'Balanced', description: 'A sensible default' },
    { value: 'detail', label: 'Detail', description: 'Fine layers, slower' },
  ];

  protected readonly wallGeneratorOptions: readonly RadioOption[] = [
    { value: 'classic', label: 'Classic', description: 'Fixed-width concentric perimeters' },
    { value: 'arachne', label: 'Arachne', description: 'Variable-width beads for thin walls' },
  ];

  protected readonly patternOptions: readonly SelectOption[] = [
    { value: 'grid', label: 'Grid', description: 'Fast, strong, two-directional' },
    { value: 'gyroid', label: 'Gyroid', description: 'Isotropic, flexible, slow' },
    { value: 'honeycomb', label: 'Honeycomb', description: 'High strength-to-weight' },
    { value: 'rectilinear', label: 'Rectilinear', description: 'Simple back-and-forth lines' },
    { value: 'tpms-d', label: 'TPMS Diamond', description: 'Smooth minimal surface' },
  ];
}
