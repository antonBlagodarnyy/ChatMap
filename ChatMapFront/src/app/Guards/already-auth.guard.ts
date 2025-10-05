import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { map, take } from 'rxjs';
import { inject } from '@angular/core';

export const alreadyAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

     return authService.user$.pipe(
        take(1),
        map((user) => {
          if (user) {
            return router.createUrlTree(['/map']);;
          } else {
            return true;
          }
        })
      );
};
