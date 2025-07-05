import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification.service';
import { Call } from '../../interfaces/call.interface';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  calls: Call[] = [];
  filteredCalls: Call[] = [];
  users: User[] = [];
  searchTerm: string = '';
  typeFilter: string = '';
  statusFilter: string = '';
  activeDropdown: string | null = null;
  selectedUserActivity: {calls: Call[], messages: Message[], user: User | undefined} | null = null;

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCalls();
    this.loadUsers();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.activeDropdown = null;
  }

  loadCalls() {
    this.mockDataService.getCalls().subscribe(calls => {
      this.calls = calls;
      this.filteredCalls = calls;
    });
  }

  loadUsers() {
    this.mockDataService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  filterCalls() {
    this.filteredCalls = this.calls.filter(call => {
      const matchesSearch = call.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           call.userId.includes(this.searchTerm) ||
                           this.getUserPhone(call.userId).includes(this.searchTerm);
      const matchesType = !this.typeFilter || call.type === this.typeFilter;
      const matchesStatus = !this.statusFilter || call.status === this.statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statusFilter = '';
    this.filterCalls();
    this.notificationService.show('Filters cleared', 'info');
  }

  refreshCalls() {
    this.loadCalls();
    this.notificationService.show('Call history refreshed', 'success');
  }

  formatDuration(seconds: number): string {
    if (seconds === 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'completed': 'bg-primary-100 text-primary-800 border border-primary-200',
      'missed': 'bg-red-100 text-red-800 border border-red-200',
      'ongoing': 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getStatusDotColor(status: string): string {
    const colors: { [key: string]: string } = {
      'completed': 'bg-primary-400',
      'missed': 'bg-red-400',
      'ongoing': 'bg-blue-400'
    };
    return colors[status] || 'bg-gray-400';
  }

  getUserPhone(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user?.phone || '';
  }

  getTimeAgo(date: Date | undefined): string {
    if (!date) return 'Unknown';
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }

  // Navigation methods
  viewChat(userId: string) {
    this.router.navigate(['/chat', userId]);
  }

  viewUserProfile(userId: string) {
    this.activeDropdown = null;
    // Navigate to user profile or show user details
    this.notificationService.show('User profile view coming soon', 'info');
  }

  viewUserActivity(userId: string) {
    this.activeDropdown = null;
    this.mockDataService.getUserActivity(userId).subscribe(activity => {
      this.selectedUserActivity = activity;
    });
  }

  closeUserActivityModal() {
    this.selectedUserActivity = null;
  }

  // Action methods
  initiateCall(userId: string, type: 'audio' | 'video') {
    this.activeDropdown = null;
    const user = this.users.find(u => u.id === userId);
    this.notificationService.show(
      `Initiating ${type} call with ${user?.name || 'patient'}...`, 
      'info'
    );
    // In a real app, this would integrate with a calling service
  }

  addCallNotes(call: Call) {
    this.activeDropdown = null;
    this.notificationService.show('Add call notes functionality coming soon', 'info');
  }

  toggleDropdown(callId: string) {
    this.activeDropdown = this.activeDropdown === callId ? null : callId;
  }
}