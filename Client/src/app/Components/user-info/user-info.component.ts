import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';
import { IUser } from '../../Interfaces/IUser';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-user-info',
  imports: [MatDialogTitle, MatDialogActions, MatChipsModule, MatButtonModule],
  template: `<h1 mat-dialog-title>Usuario: {{ user?.username }}</h1>
    <!--TODO add more user data-->
    <!--     <mat-dialog-content>
      {{ user?.username }}
    </mat-dialog-content> -->
    <mat-dialog-actions>
      <button mat-button (click)="openChat()">Chat</button></mat-dialog-actions
    >`,
})
export class UserInfoComponent implements OnInit {
  user?: IUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { featureData: { id: number } },
    private dialogRef: MatDialogRef<UserInfoComponent>,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserDataById$(this.data.featureData.id)
      .subscribe((user) => {
        this.user = user;
      });
  }

  openChat() {
    if (this.user) {
      this.dialogRef.close();
      this.router.navigate(['/chat', this.data.featureData.id]);
    }
  }
}
