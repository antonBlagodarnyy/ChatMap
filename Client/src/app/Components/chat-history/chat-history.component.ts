import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChatPreview } from '../../Interfaces/ChatPreview';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-chat-history',
  imports: [TitleCasePipe, DatePipe],
  template: `
    <div class="container">
      @for (chat of chats(); track $index) {
      <div
        class="container-chat"
        [class.even]="$index % 2 == 0"
        (click)="openChat(chat.partnerId, chat.partnerUsername)"
      >
        <div class="container-chat-sender">
          {{ chat.partnerUsername | titlecase }}
        </div>
        <div class="container-chat-ts">{{ chat.message.ts | date }}</div>
      </div>
      }@empty{
      <span
        >You haven't opened any chats! Text someone to start a
        conversation.</span
      >
      }
    </div>
  `,
  styles: `.container{
    padding:4vh;
    overflow-y:hidden;
  }
  .container-chat{
    padding:2vh;
    border-radius:10px;
    display: flex;
    justify-content: space-between;
  }
  .even{
    background-color:#E0F9FF;
  }
  .container-chat {
    cursor:pointer;
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
      console.log(res);
      this.chats.set(res);
    });
  }
  openChat(partnerId: number, partnerUsername: string) {
    this.dialogRef.close();
    sessionStorage.setItem('recipientId', partnerId.toString());
    sessionStorage.setItem('recipientUsername', partnerUsername);
    this.router.navigate(['/chat']);
  }
}
