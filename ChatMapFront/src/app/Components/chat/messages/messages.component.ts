import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../Services/chat.service';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  constructor(private chatService: ChatService){}

  ngOnInit(): void {
  this.chatService.connect();  
  }
//TODO fetch messages from db and show already stored messages

//TODO connect to the websocket and on next render a new message
}
