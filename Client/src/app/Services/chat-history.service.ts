import { inject, Injectable } from '@angular/core';
import { ChatPreview } from '../Interfaces/ChatPreview';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { SavedMessage } from '../Interfaces/SavedMessage';

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  private http = inject(HttpClient);

  private chats = new BehaviorSubject<ChatPreview[]>([]);
  chatsSubject$ = this.chats.asObservable();

  currentUserId: number | undefined;
  constructor() {}

  getChatsHistory$() {
    return this.http
      .get<ChatPreview[]>(environment.apiUrl + 'message/retrieveChats')
      .pipe(tap((c) => this.chats.next(c)));
  }
  addMessage(msg: SavedMessage, currentPartnerId: number | undefined) {
    const chatIsOpened = msg.message.senderId === currentPartnerId;

    msg.message.isSentByCurrentUser =
      this.currentUserId == msg.message.senderId;

    const partner = msg.message.isSentByCurrentUser
      ? {
          partnerId: msg.message.receiverId,
          partnerUsername: msg.message.receiver,
        }
      : {
          partnerId: msg.message.senderId,
          partnerUsername: msg.message.sender,
        };

    const chats = this.chats.value;
    const index = chats.findIndex((c) => c.partnerId === partner.partnerId);

    let updatedChats;

    if (index !== -1) {
      updatedChats = chats.map((chat, i) =>
        i === index
          ? {
              ...chat,
              message: { ...msg.message, isRead: chatIsOpened },
              unreadCount:
                chatIsOpened || msg.message.isSentByCurrentUser
                  ? chat.unreadCount
                  : chat.unreadCount + 1,
            }
          : chat
      );
    } else {
      updatedChats = [
        ...chats,
        {
          ...partner,
          message: { ...msg.message, isRead: chatIsOpened },
          unreadCount: chatIsOpened || msg.message.isSentByCurrentUser ? 0 : 1,
        },
      ];
    }

    this.chats.next(updatedChats);
  }
  readChat(currentPartnerId: number | undefined) {
    if (currentPartnerId) {
      console.log('hit');
      const chats = this.chats.value;
      const index = chats.findIndex((c) => c.partnerId === currentPartnerId);

      let updatedChats;

      if (index !== -1) {
        updatedChats = chats.map((chat, i) =>
          i === index
            ? {
                ...chat,
                message: { ...chat.message, isRead: true },
                unreadCount: 0,
              }
            : chat
        );
        this.chats.next(updatedChats);
      }
    }
  }
}
