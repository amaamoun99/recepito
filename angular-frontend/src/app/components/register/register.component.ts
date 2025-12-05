import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const { username, email, password } = this.registerForm.value;

      this.authService.register({ username, email, password }).subscribe({
        next: () => {
          alert('Account created successfully!');
          this.router.navigate(['/']);
          this.isSubmitting = false;
        },
        error: (error: any) => {
          alert(error.error?.message || 'Registration failed');
          this.isSubmitting = false;
        }
      });
    }
  }

  get passwordMismatch(): boolean {
    return !!this.registerForm.hasError('passwordMismatch') && 
           !!this.registerForm.get('confirmPassword')?.touched;
  }
}

