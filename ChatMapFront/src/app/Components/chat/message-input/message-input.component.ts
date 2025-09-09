import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../../../Services/chat.service';



@Component({
  selector: 'app-message-input',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule],
  template: `<div class="container">
    <mat-form-field>
      <mat-label>
        <input matInput type="text" [formControl]="msgInput" />
      </mat-label>
    </mat-form-field>
    <button mat-raised-button (click)="sendMsg()">Send</button>
  </div>`,
  styles: `.container{
    display:flex;
    align-items:center;
    justify-content:center;
  }`,
})
export class MessageInputComponent implements OnInit {

  msgInput = new FormControl('', Validators.required);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  sendMsg() {
      if (this.msgInput.value) this.chatService.sendMsg(this.msgInput.value);
  }
}
