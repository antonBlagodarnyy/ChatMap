import { Component, OnInit, signal } from '@angular/core';
import { HttpCallsService } from '../../Services/http-calls.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { IChatPreview } from '../../Interfaces/IChatPreview';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-history',
  imports: [TitleCasePipe, DatePipe],
  template: `
    <div class="container">
      @for (chat of chats(); track $index) {
      <div
        class="container-chat"
        [class.even]="$index % 2 == 0"
        (click)="openChat(chat.partnerId)"
      >
        <div class="container-chat-sender">
          {{ chat.partnerName | titlecase }}
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
    private httpCalls: HttpCallsService,
    private dialogRef: MatDialogRef<ChatHistoryComponent>,
    private router: Router
  ) {}
  chats = signal<IChatPreview[]>([]);

  ngOnInit(): void {
    this.httpCalls.chatHistory$().subscribe((res) => {
      this.chats.set(res.chats);
    });
  }
  openChat(partnerId: number) {
    this.dialogRef.close();
    this.router.navigate(['/chat', partnerId]);
  }
}
