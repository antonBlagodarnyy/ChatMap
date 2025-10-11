import { Routes } from '@angular/router';
import { LoginComponent } from './Components/auth/login/login.component';
import { SignupComponent } from './Components/auth/signup/signup.component';
import { WelcomeComponent } from './Pages/welcome/welcome.component';
import { MapComponent } from './Pages/map/map.component';
import { NoAuthGuard } from './Guards/no-auth.guard';
import { ChatComponent } from './Pages/chat/chat.component';
import { LocationComponent } from './Pages/location/location.component';
import { locationGuard } from './Guards/location.guard';
import { alreadyAuthGuard } from './Guards/already-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [alreadyAuthGuard],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
    canActivate: [alreadyAuthGuard],
  },
  {
    path: 'location',
    component: LocationComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [NoAuthGuard, locationGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [NoAuthGuard, locationGuard],
  },
];
