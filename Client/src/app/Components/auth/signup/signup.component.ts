import { Component } from '@angular/core';
import { passwordMatch } from './ValidationFunctions';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { MatError, MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    MatError,
  ],
  templateUrl: './signup.component.html',
  styleUrl: '../auth.styles.css',
})
export class SignupComponent {
  constructor(private authService: AuthService, private router: Router) {}

  registerForm = new FormGroup(
    {
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
    },
    { validators: passwordMatch }
  );


  onSubmit() {
    if (!this.registerForm.invalid) {
      const form = this.registerForm.value;
      if (
        form.email != null &&
        form.userName != null &&
        form.password != null
      ) {
        this.authService
          .signin$(form.userName, form.email, form.password)
          .subscribe({
            next: () => {
              this.router.navigate(['/location']);
            },
            error: (err) => {
              console.error(err);
            },
          });
      }
    }
  }
}
