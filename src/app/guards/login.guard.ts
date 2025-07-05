import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // If user is authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      return this.router.createUrlTree(["/dashboard"]);
    } else {
      // If not authenticated, allow access to login page
      return true;
    }
  }
}
