// src/app/core/auth/msal.config.ts
import { PublicClientApplication, BrowserCacheLocation, Configuration } from '@azure/msal-browser';
import { environment } from './environment';

const origin = window.location.origin;
const msalConfig: Configuration = {
  auth: {
    clientId: environment.clientId,
    authority: environment.authority,
    redirectUri: `${origin}/`,
    postLogoutRedirectUri: `${origin}/#/login`,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
};

export function msalInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication(msalConfig);
}
