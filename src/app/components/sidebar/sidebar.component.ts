import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public isMobileMenuOpen = false;
  public isProfileDropdownOpen = false;
  public isMobile = false;
  public isDesktopCollapsed = false;
  private subscriptions = new Subscription();

  public menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/whatsapp-chatbot', label: 'WhatsApp Chatbot', icon: 'chat' },
    { path: '/users', label: 'Users', icon: 'people' },
    { path: '/calls', label: 'Calls', icon: 'phone' },
    { path: '/orders', label: 'Orders', icon: 'assignment' },
    { path: '/settings', label: 'Settings', icon: 'settings' }
  ];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    
    // Subscribe to sidebar collapse state
    this.subscriptions.add(
      this.sidebarService.isCollapsed$.subscribe(collapsed => {
        this.isDesktopCollapsed = collapsed;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-section')) {
      this.isProfileDropdownOpen = false;
    }
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 1024; // lg breakpoint
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  public toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  public onMenuItemClick() {
    if (this.isMobile) {
      this.closeMobileMenu();
    }
  }

  public toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  public toggleDesktopSidebar() {
    this.sidebarService.toggleCollapse();
  }

  public viewProfile() {
    this.isProfileDropdownOpen = false;
    this.notificationService.show('Profile view coming soon', 'info');
  }

  public openSettings() {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/settings']);
  }

  public signOut() {
    this.isProfileDropdownOpen = false;
    this.notificationService.show('Signing out...', 'info');
    // Implement actual sign out logic here
    setTimeout(() => {
      this.notificationService.show('Successfully signed out', 'success');
      // Redirect to login page or handle sign out
    }, 1000);
  }
}