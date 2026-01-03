import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { UserAuth } from '../../Interfaces/UserAuth';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';
import { UserListComponent } from '../user-list/user-list.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatHistoryService } from '../../Services/chat-history.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatService } from '../../Services/chat.service';
import { Subject,takeUntil, } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterLink, RouterLinkActive, MatBadgeModule],
  template: `<div class="container">
    <h2>{{ user?.username }}</h2>
    <button
      mat-raised-button
      matBadge="{{
        this.unreadChats().length > 0 ? this.unreadChats().length : ''
      }}"
      (click)="openChatHistory()"
    >
      Chats
    </button>
    <button mat-raised-button (click)="openUsers()">Users</button>
    <a routerLink="/map" mat-button routerLinkActive="router-link-active"
      >Map</a
    >
    <button mat-raised-button (click)="logout()">Logout</button>
  </div>`,
  styles: `.router-link-active{
   display:none;
  }
  .container{
    padding:1rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }`,
})
export class HeaderComponent implements OnInit {
  private chatService = inject(ChatService);
  private chatHistoryService = inject(ChatHistoryService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogRef = inject(MatDialog);

  protected user?: UserAuth | null;

  chats = toSignal(this.chatHistoryService.chatsSubject$, {
    initialValue: [],
  });

  unreadChats = computed(() => this.chats().filter((c) => c.unreadCount > 0 && !c.message.isSentByCurrentUser));

  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.chatService.currentUserId = user?.id
      this.chatHistoryService.currentUserId = user?.id
       });
   
        this.chatHistoryService.getChatsHistory$().subscribe();

        this.chatService.disconnect();
        this.chatService.openLoader();

        this.chatService
          .connect$()
          .pipe(takeUntil(this.destroy$))
          .subscribe((msg) => {
            if (msg.type === 'SAVED') {
              this.chatService.receiveMsg$(msg);
              this.chatHistoryService.addMessage(msg, this.chatService.getPartner()?.id);
            }
          });
      
   
  }

  logout() {
    this.authService.clearUser();
    this.router.navigate(['/']);
  }
  openChatHistory() {
    this.dialogRef.open(ChatHistoryComponent, { data: this.chats });
  }
  openUsers() {
    this.dialogRef.open(UserListComponent);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatService.disconnect();
  }
}
