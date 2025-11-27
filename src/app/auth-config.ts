// src/app/auth-config.ts
import {
    BrowserCacheLocation,
    Configuration,
    RedirectRequest,
} from '@azure/msal-browser';
import { environment } from '../environment';

const origin = window.location.origin;

export const msalConfig: Configuration = {
    auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: `${origin}/`,
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false,
    },
};

export const loginRequest: RedirectRequest = {
    scopes: ['User.Read'],
};
