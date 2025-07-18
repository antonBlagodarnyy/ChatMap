import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { IUserAuth } from '../../../Interfaces/IUserAuth';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  template: `<div class="container">
    <div class="container-user">
      <h2>{{ user?.username }}</h2>
    </div>

    <button mat-raised-button (click)="logout()">Logout</button>
  </div>`,
  styles: `.container{
    padding:1vh;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }`,
})
export class HeaderComponent implements OnInit {
  protected user?: IUserAuth | null;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.user.subscribe((user) => (this.user = user));
  }
  logout() {
    this.authService.logout();
  }
}
