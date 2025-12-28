import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MapService } from '../../Services/map.service';
import { Router } from '@angular/router';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-user-list',
  imports: [MatDialogContent, TitleCasePipe, MatButtonModule, MatIcon],
  template: `<mat-dialog-content>
    @for (user of users(); track $index) {
    <div class="container-user" [class.even]="$index % 2 == 0">
      <span>
        {{ user.username | titlecase }}
      </span>
      <span>
        {{ user.address | titlecase }}
      </span>
      <button mat-icon-button (click)="onSearch(user.lat, user.lon)">
        <mat-icon>search</mat-icon>
      </button>
      <button mat-icon-button (click)="openChat(user.id, user.username)">
        <mat-icon>chat</mat-icon>
      </button>
    </div>
    }@empty{
    <span>There are no users registered!.</span>
    }
  </mat-dialog-content>`,
  styles: `.container-user{
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
     cursor:pointer;
  }
  .even{
    background-color:#E0F9FF;
  }
  span{
    margin: 0 2rem 0 2rem;
  }`,
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private mapService = inject(MapService);
  private chatService = inject(ChatService);
  private dialogRef = inject(MatDialogRef);

  private router = inject(Router);

  users = toSignal(this.userService.usersSubject$, { initialValue: [] });

  ngOnInit(): void {
    this.userService.getUsers$().subscribe();
  }

  onSearch(lat: number, lon: number) {
    if (this.router.url.startsWith('/chat')) {
      this.router.navigate(['/map']);
    }
    this.mapService.setMapCenter(lat, lon);
    this.dialogRef.close();
  }
  openChat(id: number, username: string) {
    this.dialogRef.close();
    this.chatService.setReceiver(id,username);

    this.router.navigate(['/chat']);
  }
}
