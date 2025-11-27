import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const activeAccount = msalService.instance.getActiveAccount();
  if (activeAccount) {
    return true;
  }

  const accounts = msalService.instance.getAllAccounts();
  if (accounts.length > 0) {
    msalService.instance.setActiveAccount(accounts[0]);
    return true;
  }

  return router.parseUrl('/login');
};
