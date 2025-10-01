import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserService } from '../../../Services/user.service';
import { IUser } from '../../../Interfaces/IUser';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../../Services/chat.service';

@Component({
  selector: 'app-user-info',
  imports: [MatDialogTitle, MatDialogActions, MatDialogContent, MatChipsModule, MatButtonModule],
  template: `<h1 mat-dialog-title>Usuario: {{ user?.username }}</h1>
    <mat-dialog-content>
      {{ user?.email }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="openChat(user?.id)">Chat</button
    ></mat-dialog-actions>`,
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  user?: IUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { featureData: { id: number } },
    private dialogRef: MatDialogRef<UserInfoComponent>,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.data.featureData.id).subscribe((user) => {
      this.user = user;
        console.log(this.user)
    });
  
  }

  openChat(userId: number | undefined) {
    this.dialogRef.close();
    this.chatService.recipient = this.user;
      this.chatService.saveRecipient();
    if (userId)
      this.router.navigateByUrl('/chat', { state: { recipientId: userId } });
  }
}
