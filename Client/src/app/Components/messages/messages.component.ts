import {
  AfterViewChecked,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { SavedMessage } from '../../Interfaces/SavedMessage';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, NgClass } from '@angular/common';
import { signal, Signal } from '@angular/core';

@Component({
  selector: 'app-messages',
  imports: [MatChipsModule, NgClass, DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.styles.css',
})
export class MessagesComponent implements AfterViewChecked {
  @ViewChild('containerMessages')
  chatContainer!: ElementRef;

  messages = input.required<Signal<SavedMessage[]>>();
  recipientName = input<string>();

  ngAfterViewChecked(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
}
