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
  imports: [ReactiveFormsModule, MatButtonModule,MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './../auth.styles.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required,]),
    password: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.authService.autoAuthUser();

    if (this.authService.user.getValue()) {
      this.router.navigate(['/location']);
    }
  }
  onSubmit() {
    if (!this.loginForm.invalid) {
      const form = this.loginForm.value;
      if (form.username != null && form.password != null) {
        this.authService.login(form.username, form.password);
      }
    }
  }
}
