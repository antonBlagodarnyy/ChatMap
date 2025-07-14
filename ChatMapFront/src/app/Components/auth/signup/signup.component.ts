import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: ` <form [formGroup]="form" (ngSubmit)="onSubmit()">
  <mat-form-field>
      <mat-label>Username</mat-label>
      <input matInput formControlName="username" type="text" />
    </mat-form-field>
    <mat-form-field>
      <mat-label>Email</mat-label>
      <input matInput formControlName="email" type="email" />
    </mat-form-field>
    <mat-form-field>
      <mat-label>Password</mat-label>
      <input matInput formControlName="password" type="password" />
    </mat-form-field>
    <button matButton type="submit"></button>
  </form>`,
  styles: `form{
    display:flex;
    flex-direction:column;
  }`,
})
export class SignupComponent {
  constructor(private authService: AuthService) {}
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });
  onSubmit() {
    const username = this.form.get('username')?.value;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    if (this.form.valid) {
      if (email && password && username)
        this.authService.signup(username, email, password);
    }
  }
}
