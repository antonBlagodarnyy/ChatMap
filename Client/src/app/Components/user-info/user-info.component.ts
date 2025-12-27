import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-info',
  imports: [MatDialogTitle, MatDialogActions, MatChipsModule, MatButtonModule],
  template: `<h1 mat-dialog-title>Usuario: {{ data.featureData.username }}</h1>
    <!--TODO add more user data-->
    <!--     <mat-dialog-content>
      {{ user?.username }}
    </mat-dialog-content> -->
    <mat-dialog-actions>
      <button mat-button (click)="openChat()">Chat</button></mat-dialog-actions
    >`,
})
export class UserInfoComponent {
  constructor(
    private dialogRef: MatDialogRef<UserInfoComponent>,
    private userService: UserService,
    private router: Router
  ) {}
  data = inject<{ featureData: { id: number; username: string } }>(
    MAT_DIALOG_DATA
  );

  openChat() {
    const { id, username } = this.data.featureData;
    if (id && username) {
      this.dialogRef.close();
      sessionStorage.setItem('recipientId', id.toString());
      sessionStorage.setItem('recipientUsername', username);

      this.router.navigate(['/chat']);
    }
  }
}
