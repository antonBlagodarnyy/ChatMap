import { Component, OnInit } from '@angular/core';
import { UserInfoComponent } from "../../Components/dev/user-info/user-info.component";
import { AuthService } from '../../Services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  imports: [UserInfoComponent, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

constructor(private authService :AuthService){}

ngOnInit(): void {
  this.authService.autoAuthUser();
}
logout() {
  this.authService.logout();
}
}
