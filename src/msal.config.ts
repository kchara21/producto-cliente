// src/app/core/auth/msal.config.ts
import { PublicClientApplication, BrowserCacheLocation, Configuration } from '@azure/msal-browser';

const origin = window.location.origin;
const msalConfig: Configuration = {
  auth: {
    clientId: '4335a4d4-0ff4-4964-8677-0b1c29dbf529',
    authority: 'https://login.microsoftonline.com/0b506217-0d47-4361-9327-8f74192bb5c5',
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
