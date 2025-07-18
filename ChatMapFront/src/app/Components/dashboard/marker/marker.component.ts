import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IUser } from '../../../Interfaces/IUser';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-marker',
  imports: [MatCardModule],
  template: ` <mat-card>
    <mat-card-title>{{ user?.username }}</mat-card-title>
  </mat-card>`,
  styles: `mat-card{
    padding:2vh;
  }
 `,
})
export class MarkerComponent implements OnInit {
  user?: IUser;
  markerId?: number;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.markerId)
      this.userService.getUserById(this.markerId).subscribe((res) => {
        this.user = res;
      });
  }
}
