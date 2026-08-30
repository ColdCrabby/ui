import type { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    // Icon loads its SVGs over HTTP; tooltips can render markdown in block mode.
    provideHttpClient(),
    provideMarkdown(),
  ],
};
