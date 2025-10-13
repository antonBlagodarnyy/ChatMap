import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './../auth.styles.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (!this.loginForm.invalid) {
      const form = this.loginForm.value;
      if (form.email != null && form.password != null) {
        this.authService.login$(form.email, form.password).subscribe({
          next: () => {
            this.router.navigate(['/map']);
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    }
  }
}
