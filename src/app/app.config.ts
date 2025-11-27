// src/app/app.config.ts
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import {
  MsalService,
  MSAL_INSTANCE,
} from '@azure/msal-angular';
import { msalInstanceFactory } from '../msal.config';

export function initializeMsal(msalService: MsalService) {
  // 👇 devuelve una función que Angular ejecuta ANTES de bootstrap
  return () => msalService.instance.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 👉 tu factory de instancia MSAL
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory,
    },
    // servicio principal de MSAL
    MsalService,

    // 👉 inicializador: llama a instance.initialize() antes de todo
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true,
    },

    // ...los demás providers que ya tenías (HttpClient, etc.)
  ],
};
