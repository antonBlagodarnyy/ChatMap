import { Component, OnInit, output, Output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { UserAuth } from '../../Interfaces/UserAuth';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  template: `<div class="container">
    <h2>{{ user?.username }}</h2>
    <button mat-raised-button (click)="openChatHistory()">Chats</button>
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
  protected user?: UserAuth | null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialog
  ) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.user = user));
  }
  logout() {
    this.authService.clearUser();
    this.router.navigate(['/']);
  }
  openChatHistory() {
    this.dialogRef.open(ChatHistoryComponent);
  }
   openUsers() {
    this.dialogRef.open(UserListComponent);
  }
}
