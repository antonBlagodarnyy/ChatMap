import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { HealthService } from '../../Services/health.service';
@Component({
  selector: 'app-welcome',
  imports: [RouterLink, MatButtonModule],
  template: `<div class="container">
    <h1 class="header">Welcome to ChatMap</h1>
    <div class="container-auth">
      <a mat-button routerLink="auth/login">Login</a>
      <a mat-button routerLink="auth/signup">Signup</a>
    </div>
  </div>`,
  styles: `.container {
  margin: auto;

}
.header {
  text-align: center;
}
.container-auth {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
`,
})
export class WelcomeComponent implements OnInit{
  
   constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.openLoader();
    this.healthService.check$().subscribe((r) => {
      console.log(r);
      
    });
    this.healthService.closeLoarder();
  }
}
