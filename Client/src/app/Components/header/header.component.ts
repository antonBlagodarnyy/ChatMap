import { Component, OnInit, output, Output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { IUserAuth } from '../../Interfaces/IUserAuth';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  template: `<div class="container">
   
      <h2>{{ user?.username }}</h2>
     <button mat-raised-button (click)="openChatHistory()">Chats</button>
    <a routerLink="/map" mat-button routerLinkActive="router-link-active"
      >Map</a
    >
    <button mat-raised-button (click)="logout()">Logout</button>
  </div>`,
  styles: `.router-link-active{
   display:none;
  }
  .container{
    padding:1vh;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }`,
})
export class HeaderComponent implements OnInit {
  protected user?: IUserAuth | null;
  currentUsername = output<string>();
  constructor(private authService: AuthService, private router: Router, private dialogRef: MatDialog) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.user = user));
    this.currentUsername.emit(this.user?.username ?? 'unknown');
  }
  logout() {
    this.authService.clearUser();
    this.router.navigate(['/']);
  }
  openChatHistory(){
    this.dialogRef.open(ChatHistoryComponent);
  }
}
