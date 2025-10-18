import { Component, OnInit, signal } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { IMessage } from '../../Interfaces/IMessage';
import { MessagesComponent } from '../../Components/chat/messages/messages.component';
import { InputBoxComponent } from '../../Components/chat/messages/input-box/input-box.component';
import { HeaderComponent } from '../../Components/map/header/header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [MessagesComponent, InputBoxComponent, HeaderComponent],
  template: `
    <app-header (currentUsername)="setCurrentUsername($event)" />
    <div class="container">
      <app-messages
        [recipientName]="this.receiverUsername"
        [messages]="messages()"
      /><app-input-box (sendMsgEvent)="sendMsg($event)" />
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
  senderUsername!: string;
  messages = signal<IMessage[] | undefined>(undefined);

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const recipientId = Number(params.get('userId'));
      if (recipientId) this.chatService.updateRecipient(recipientId);
    });

    this.chatService.openLoader();

    this.chatService.getReceiver$().subscribe((r) => {
      if (r) {
        this.receiverUsername = r.username;
      }
    });

    this.chatService.connect$().subscribe((msg) => {
      //On message received update the messages
      this.messages.update((oldMessages) => {
        return oldMessages
          ? [...oldMessages, { sender: this.receiverUsername, text: msg.msg }]
          : [{ sender: this.receiverUsername, text: msg.msg }];
      });
    });
  }

  sendMsg(msg: string) {
    //Update the messages container and send it to the ws
    this.messages.update((oldMessages) => {
      return oldMessages
        ? [...oldMessages, { sender: this.senderUsername, text: msg }]
        : [{ sender: this.senderUsername, text: msg }];
    });
    this.chatService.sendMsg(msg);
  }
  setCurrentUsername(username: string) {
    this.senderUsername = username;
  }
}
