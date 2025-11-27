import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { loginRequest } from '../../auth-config';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private msal   = inject(MsalService);
  private router = inject(Router);

  nombreUsuario: string | null = null;

  ngOnInit() {
    const accounts = this.msal.instance.getAllAccounts();

    if (accounts.length > 0) {
      const acc = accounts[0];
      this.nombreUsuario = acc.name ?? acc.username ?? null;
      // Opcional: redirigir directo
      this.router.navigate(['/productos']);
    }
  }

  onLogin() {
    this.msal.loginRedirect(loginRequest);
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }
}
