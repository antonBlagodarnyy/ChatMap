import { CanActivateFn, Router } from '@angular/router';
import { LocationService } from '../Services/location.service';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { map } from 'rxjs';

export const locationGuard: CanActivateFn = (route, state) => {
  const locationService = inject(LocationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.user$.getValue()?.token;

  if (token) {
    return locationService.currentUserLocation$().pipe(
      map((l) => {

        if (Object.keys(l).length != 0) return true;
        else return router.createUrlTree(['/location']);
      })
    );
  } else return router.createUrlTree(['/']);
};
