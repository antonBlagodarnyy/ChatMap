import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChatPreview } from '../../Interfaces/ChatPreview';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChatService } from '../../Services/chat.service';
import { FoldedTextPipe } from '../../Pipes/FoldedTextPipe';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatHistoryService } from '../../Services/chat-history.service';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-chat-history',
  imports: [
    TitleCasePipe,
    DatePipe,
    FoldedTextPipe,
    MatDialogContent,
    MatBadgeModule,
  ],
  template: `
    <mat-dialog-content>
      @for (chat of chats(); track $index) {
      <div
        matBadge="{{ chat.unreadCount != 0 ? chat.unreadCount : '' }}"
        class="container-chat"
        [class.even]="$index % 2 == 0"
        (click)="openChat(chat.partnerId, chat.partnerUsername)"
      >
        <span>
          {{ chat.partnerUsername | titlecase }}
        </span>
        <span>{{ chat.message.text| foldedTextPipe : 20 }}</span>
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
export class ChatHistoryComponent {
  private chatHistoryService = inject(ChatHistoryService);
  private chatService = inject(ChatService);
  protected chats = inject<Signal<ChatPreview[]>>(MAT_DIALOG_DATA);

  constructor(
    private dialogRef: MatDialogRef<ChatHistoryComponent>,
    private router: Router
  ) {}

 

  openChat(id: number, username: string) {
    this.dialogRef.close();
    this.chatService.setPartner(id, username);

    this.router.navigate(['/chat']);
  }
}
