import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChatPreview } from '../../Interfaces/ChatPreview';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChatService } from '../../Services/chat.service';
import { FoldedTextPipe } from '../../Pipes/FoldedTextPipe';

@Component({
  selector: 'app-chat-history',
  imports: [TitleCasePipe, DatePipe, FoldedTextPipe, MatDialogContent],
  template: `
    <mat-dialog-content>
      @for (chat of chats(); track $index) {
      <div
        class="container-chat"
        [class.even]="$index % 2 == 0"
        (click)="openChat(chat.partnerId, chat.partnerUsername)"
      >
        <span>
          {{ chat.partnerUsername | titlecase }}
        </span>
        <span>{{ chat.message.text | foldedTextPipe : 20 }}</span>
        <span>{{ chat.message.ts | date }}</span>
      </div>
      }@empty{
      <span
        >You haven't opened any chats! Text someone to start a
        conversation.</span
      >
      }
    </mat-dialog-content>
  `,
  styles: `
  .container-chat{
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    cursor:pointer;
  }
  .even{
    background-color:#E0F9FF;
  }
  span{
    margin: 0 2rem 0 2rem;
  }`,
})
export class ChatHistoryComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private dialogRef: MatDialogRef<ChatHistoryComponent>,
    private router: Router
  ) {}
  chats = signal<ChatPreview[]>([]);

  ngOnInit(): void {
    this.chatService.chatHistory$().subscribe((res) => {
      this.chats.set(res);
    });
  }
  openChat(id: number, username: string) {
    this.dialogRef.close();
    this.chatService.setReceiver(id, username);

    this.router.navigate(['/chat']);
  }
}
