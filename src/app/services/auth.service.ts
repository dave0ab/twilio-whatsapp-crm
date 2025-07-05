import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = "healthcare_admin_auth";
  private readonly DEMO_CREDENTIALS = {
    username: "admin",
    password: "admin",
  };

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        if (
          userData &&
          userData.id &&
          userData.email &&
          userData.name &&
          userData.role
        ) {
          this.currentUserSubject.next(userData);
        } else {
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      this.clearStorage();
    }
  }

  private saveUserToStorage(user: User) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  }

  private clearStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      // Simulate Google OAuth flow
      // In a real implementation, you would use Firebase Auth or Google OAuth
      await this.simulateAsyncOperation(1500);

      // Mock successful Google sign-in
      const user: User = {
        id: "google_" + Date.now(),
        email: "user@gmail.com",
        name: "Google User",
        avatar:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        role: "admin",
      };

      this.currentUserSubject.next(user);
      this.saveUserToStorage(user);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: "Google sign-in failed" };
    }
  }

  async signInWithCredentials(
    username: string,
    password: string
  ): Promise<AuthResult> {
    try {
      // Simulate API call delay
      await this.simulateAsyncOperation(1000);

      // Check demo credentials
      if (
        username === this.DEMO_CREDENTIALS.username &&
        password === this.DEMO_CREDENTIALS.password
      ) {
        const user: User = {
          id: "admin_user",
          email: "admin@healthcare.com",
          name: "Dr. Mike Wilson",
          avatar:
            "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          role: "admin",
        };

        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);

        return { success: true, user };
      } else {
        return { success: false, error: "Invalid username or password" };
      }
    } catch (error) {
      return { success: false, error: "Authentication failed" };
    }
  }

  signOut(): void {
    this.currentUserSubject.next(null);
    this.clearStorage();
    this.router.navigate(["/login"]);
  }

  // Method to clear authentication without navigation (useful for guards)
  clearAuth(): void {
    this.currentUserSubject.next(null);
    this.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private simulateAsyncOperation(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Method to check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Method to get user token (for API calls)
  getToken(): string | null {
    const user = this.getCurrentUser();
    if (user) {
      // In a real implementation, this would return a JWT token
      return btoa(JSON.stringify({ userId: user.id, role: user.role }));
    }
    return null;
  }

  // Method to check if current route is login
  isLoginRoute(): boolean {
    return this.router.url === "/login";
  }
}
