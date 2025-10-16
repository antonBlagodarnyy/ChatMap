import { Component, OnInit, Signal, signal } from '@angular/core';
import { ChatService } from '../../Services/chat.service';

import { IMessage } from '../../Interfaces/IMessage';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';
import { MessagesComponent } from '../../Components/chat/messages/messages.component';
import { InputBoxComponent } from '../../Components/chat/messages/input-box/input-box.component';
import { HeaderComponent } from '../../Components/map/header/header.component';
import { LoadingComponent } from '../../Components/loading/loading.component';

@Component({
  selector: 'app-chat',
  imports: [MessagesComponent, InputBoxComponent, HeaderComponent],
  template: `
    <app-header />
    <div class="container">
      <app-messages
        [recipientName]="this.receiverUsername"
        [messages]="messages.getValue()"
      /><app-input-box />
    </div>
  `,
  styles: `.container{
    height:100%;
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
export class ChatComponent implements OnInit {
  receiverUsername!: string;
  receiverId!: number;
  messages = new BehaviorSubject<IMessage[] | undefined>(undefined);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.openLoader();
    this.chatService.getReceiver$().subscribe((r) => {
      if (r) {
        this.receiverUsername = r.username;
        this.receiverId = r.id;
      }
    });

    this.chatService.connect$().subscribe({
      next: (msg) => {
        console.log(msg);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
