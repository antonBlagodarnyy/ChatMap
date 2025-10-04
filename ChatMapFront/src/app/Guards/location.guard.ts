import { CanActivateFn, Router } from '@angular/router';
import { LocationService } from '../Services/location.service';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { map } from 'rxjs';

export const locationGuard: CanActivateFn = (route, state) => {
  const locationService = inject(LocationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const userId = authService.user.getValue()?.userId;

  if (userId) {
    return locationService.getLocationById$(userId).pipe(
      map((l) => {
        if (l) return true;
        else return router.createUrlTree(['/location']);
      })
    );
  } else return router.createUrlTree(['/']);
};
