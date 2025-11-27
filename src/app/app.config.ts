// src/app/app.config.ts
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import {
  MsalService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MsalGuard,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import { msalInstanceFactory } from '../msal.config';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './auth-config';

export function initializeMsal(msalService: MsalService) {
  // 👇 devuelve una función que Angular ejecuta ANTES de bootstrap
  return () =>
    msalService.instance.initialize().then(() =>
      msalService.instance.handleRedirectPromise().then((result) => {
        if (result?.account) {
          msalService.instance.setActiveAccount(result.account);
        }
      })
    );
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
    loginFailedRoute: '/login',
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 👉 tu factory de instancia MSAL
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: msalGuardConfigFactory,
    },
    // servicio principal de MSAL
    MsalService,
    MsalGuard,

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
