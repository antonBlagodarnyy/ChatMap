import { Component } from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { ChatService } from '../../../../Services/chat.service';

@Component({
  selector: 'app-input-box',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  template: ` <form (submit)="onMsgSent()">
    <div class="container-input-box">
      <mat-form-field class="form-field" appearance="outline">
        <mat-label>Send smth</mat-label>
        <input
          name="inputContent"
          matInput
          required
          [(ngModel)]="inputContent"
          [errorStateMatcher]="matcher"
        />
      </mat-form-field>

      <button class="button-enter" type="submit" mat-fab>Enter</button>
    </div>
  </form>`,
  styles: `
  .container-input-box{
    display: flex;
    justify-content:center;
    width:100%;

  }
  .form-field{
    padding: 2vh;
    width:90%;
  }
  .button-enter{
    margin-top: 2vh;
  }`,
})
export class InputBoxComponent {
  inputContent?: string;
  constructor(private chatService: ChatService) {}
  matcher = new MyErrorStateMatcher();
  onMsgSent() {
    if (this.inputContent) {
      this.chatService.sendMsg(this.inputContent);
      this.inputContent = '';
    }
  }
}
class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return false;
  }
}
