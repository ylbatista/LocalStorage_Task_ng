import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class isLoggedGuard implements CanActivate {

  constructor(
    private authService: AuthService, private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLogged()) {
      // console.log( 'Usuario autenticado');
      return true;
    } else {
      // console.log( 'Pasó por el Guard y no hay usuario autenticado');
      this.router.navigate(['/login']);
      return false;
    }
  }
}