import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-user-info',
  imports: [],
  template:`<div class="container">
    <h2>Current user data:</h2>
    <p>{{this.token}}</p>
     <p>{{this.expirationDate}}</p>
      <p>{{this.userId}}</p>
  </div>`,
  styles: ``,
})
export class UserInfoComponent implements OnInit {
  constructor(private authService: AuthService) {}

  protected token?: string;
  protected expirationDate?: Date;
  protected userId?: number;

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const data = this.authService.user.getValue();
    this.token = data?.token;
    this.expirationDate = data?.expirationDate;
    this.userId = data?.userId;
  }
}
