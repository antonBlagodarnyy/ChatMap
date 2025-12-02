import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from '../Interfaces/IMessage';
import { environment } from '../../environments/environment';
import { IChatPreview } from '../Interfaces/IChatPreview';

@Injectable({
  providedIn: 'root',
})
export class HttpCallsService {
  constructor(private http: HttpClient) {}

  chatHistory$() {
    return this.http.get<{chats:IChatPreview[]}>(
      environment.apiUrl + 'message/retrieveChats'
    );
  }
}
