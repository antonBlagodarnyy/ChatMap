import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-user-info',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatChipsModule,
    MatButtonModule,
    MatDialogContent,
  ],
  template: `<h1 mat-dialog-title>Usuario: {{ data.featureData.username }}</h1>

    <mat-dialog-content>
      {{ data.featureData.address }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="openChat()">Chat</button></mat-dialog-actions
    >`,
})
export class UserInfoComponent {
  private chatService = inject(ChatService);

  constructor(
    private dialogRef: MatDialogRef<UserInfoComponent>,
    private router: Router
  ) {}
  data = inject<{
    featureData: { id: number; username: string; address: string };
  }>(MAT_DIALOG_DATA);

  openChat() {
    const { id, username } = this.data.featureData;
    if (id && username) {
      this.dialogRef.close();
      this.chatService.setPartner(id, username);

      this.router.navigate(['/chat']);
    }
  }
}
