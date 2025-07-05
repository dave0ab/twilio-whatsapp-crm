import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: ''
  };

  isLoading = false;
  isManualLoading = false;
  isGoogleLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async signInWithGoogle() {
    this.isGoogleLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.signInWithGoogle();
      if (result.success) {
        this.notificationService.show('Successfully signed in with Google!', 'success');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = result.error || 'Google sign-in failed';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred during Google sign-in';
      console.error('Google sign-in error:', error);
    } finally {
      this.isGoogleLoading = false;
    }
  }

  async signInManually() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isManualLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.signInWithCredentials(
        this.credentials.username,
        this.credentials.password
      );

      if (result.success) {
        this.notificationService.show('Successfully signed in!', 'success');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = result.error || 'Invalid credentials';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred during sign-in';
      console.error('Manual sign-in error:', error);
    } finally {
      this.isManualLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Quick fill demo credentials
  fillDemoCredentials() {
    this.credentials.username = 'admin';
    this.credentials.password = 'admin';
  }
}