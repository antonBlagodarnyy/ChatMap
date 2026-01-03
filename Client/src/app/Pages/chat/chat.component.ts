import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { MessagesComponent } from '../../Components/messages/messages.component';
import { InputBoxComponent } from '../../Components/messages/input-box/input-box.component';
import { HeaderComponent } from '../../Components/header/header.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat',
  imports: [MessagesComponent, InputBoxComponent, HeaderComponent],
  template: `
    <app-header />
    <div class="container">
      <app-messages
        [recipient]="receiver"
        [messages]="messages"
      /><app-input-box (sendMsgEvent)="sendMsg($event)" />
    </div>
  `,
  styles: `.container{
    height:80%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  app-messages{
    width:80%;
  }
  app-input-box{
    width:90%;
  }`,
})
export class ChatComponent implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  messages = toSignal(this.chatService.messagesSubject$, { initialValue: [] });
  receiver = toSignal(this.chatService.partner$, { initialValue: null });
  constructor() {}

  ngOnInit(): void {
    this.chatService.partner$.subscribe(() => {
      this.chatService.clearChat();
      this.chatService.retrieveMessages$().subscribe();
    });

    this.chatService.messagesSubject$.subscribe((messages) => {
      const partner = this.chatService.getPartner();
      if (!partner) return;

      const hasUnread = messages.some((m) => {
        return !m.message.isRead && m.message.receiverId !== partner.id;
      });

      if (hasUnread) {
        this.chatService.readMessages$().subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.clearParnter();
  }

  sendMsg(msg: string) {
    this.chatService.sendMsg(msg);
  }
}
