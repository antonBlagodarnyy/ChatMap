import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `<div class="container">
    <router-outlet />
  </div>`,
  styles: `.container{
    padding:8vh;
    display:flex;
    justify-content:center;
  }`,
})

export class AuthComponent {}
