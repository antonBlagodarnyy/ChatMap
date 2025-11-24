import {
  AfterViewChecked,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { IMessage } from '../../../Interfaces/IMessage';
import { MatChipsModule } from '@angular/material/chips';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [MatChipsModule, NgClass],
  templateUrl: './messages.component.html',
  styleUrl: './messages.styles.css',
})
export class MessagesComponent implements AfterViewChecked {
  @ViewChild('containerMessages')
  chatContainer!: ElementRef;

  messages = input<IMessage[] | undefined>();
  recipientName = input<string>();

  ngAfterViewChecked(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
}
