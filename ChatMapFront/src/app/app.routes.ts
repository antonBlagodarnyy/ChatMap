import { Routes } from '@angular/router';
import { LoginComponent } from './Components/auth/login/login.component';
import { SignupComponent } from './Components/auth/signup/signup.component';
import { WelcomeComponent } from './Pages/welcome/welcome.component';
import { MapComponent } from './Pages/map/map.component';
import { AuthGuard } from './Guards/auth-guard';
import { ChatComponent } from './Pages/chat/chat.component';
import { LocationComponent } from './Pages/location/location.component';
import { locationGuard } from './Guards/location.guard';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  { path: 'location', component: LocationComponent, canActivate: [AuthGuard] },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [AuthGuard, locationGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard, locationGuard],
  },
];
