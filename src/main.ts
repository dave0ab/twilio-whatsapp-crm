import { Component, OnInit, HostListener } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app/app.routes";
import { SidebarComponent } from "./app/components/sidebar/sidebar.component";
import { ToastComponent } from "./app/components/toast/toast.component";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { SidebarService } from "./app/services/sidebar.service";
import { AuthService } from "./app/services/auth.service";
import { filter, combineLatest } from "rxjs/operators";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent],
  providers: [SidebarService],
  template: `
    <div class="app-container flex h-screen bg-gray-50 overflow-hidden">
      <!-- Only show sidebar when authenticated and not on login page -->
      <app-sidebar *ngIf="shouldShowSidebar"></app-sidebar>

      <main
        class="main-content flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        [class.ml-64]="
          !isMobile && !isDesktopSidebarCollapsed && shouldShowSidebar
        "
        [class.ml-16]="
          !isMobile && isDesktopSidebarCollapsed && shouldShowSidebar
        "
        [class.ml-0]="!shouldShowSidebar"
      >
        <div class="content-area flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
    <app-toast></app-toast>
  `,
  styles: [
    `
      .app-container {
        height: 100vh;
        overflow: hidden;
      }

      .main-content {
        min-width: 0;
        transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        @media (max-width: 1023px) {
          width: 100%;
          margin-left: 0 !important;
        }
      }

      .content-area {
        @media (max-width: 1023px) {
          padding-top: 4rem;
        }

        @media (min-width: 1024px) {
          padding-top: 0;
        }

        // Override padding for login page
        &.login-page {
          padding-top: 0 !important;
        }
      }

      .content-area {
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        &::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      }
    `,
  ],
})
export class App implements OnInit {
  isMobile = false;
  isDesktopSidebarCollapsed = false;
  isLoginPage = false;
  isAuthenticated = false;
  shouldShowSidebar = false;
  isInitialized = false;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkScreenSize();

    // Subscribe to sidebar state changes
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isDesktopSidebarCollapsed = collapsed;
    });

    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = user !== null;
      this.updateSidebarVisibility();
    });

    // Listen to route changes to detect login page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = this.authService.isLoginRoute();
        this.updateSidebarVisibility();
      });

    // Initialize state after a brief delay to ensure everything is loaded
    setTimeout(() => {
      this.isLoginPage = this.authService.isLoginRoute();
      this.isAuthenticated = this.authService.isAuthenticated();
      this.updateSidebarVisibility();
      this.isInitialized = true;
    }, 0);
  }

  private updateSidebarVisibility() {
    // Only show sidebar if user is authenticated AND not on login page AND app is initialized
    this.shouldShowSidebar =
      this.isAuthenticated && !this.isLoginPage && this.isInitialized;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
    if (this.isMobile) {
      this.isDesktopSidebarCollapsed = false;
    }
  }
}

bootstrapApplication(App, {
  providers: [provideRouter(routes), provideAnimations()],
});
