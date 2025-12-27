import { CanActivateFn, Router } from '@angular/router';
import { LocationService } from '../Services/location.service';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { map, of, switchMap } from 'rxjs';

export const locationGuard: CanActivateFn = (route, state) => {
  const locationService = inject(LocationService);
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user$.pipe(
    switchMap((u) => {
      const token = u?.token;
      if (!token) {
        // Si no hay token, redirige al inicio
        return of(router.createUrlTree(['/']));
      }
      // Si hay token, comprobamos la ubicación del usuario
      return locationService.currentUserLocation$().pipe(
        map((l) => {
          return l != null ? true : router.createUrlTree(['/location']); // Redirigir a página de ubicación
        })
      );
    })
  );
};
