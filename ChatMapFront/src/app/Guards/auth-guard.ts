import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    this.authService.autoAuthUser();
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      })
    );
  }
}
