import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  roleFilter: string = '';
  statusFilter: string = '';
  showAddUserForm: boolean = false;
  
  newUser: Partial<User> = {
    name: '',
    phone: '',
    email: '',
    role: 'patient'
  };

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.mockDataService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = [...this.users];
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone.includes(this.searchTerm);
      
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getRoleStyle(role: string): string {
    const styles: { [key: string]: string } = {
      'admin': 'bg-red-100 text-red-800',
      'agent': 'bg-blue-100 text-blue-800',
      'support': 'bg-green-100 text-green-800',
      'patient': 'bg-gray-100 text-gray-800'
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  }

  viewChat(userId: string) {
    this.router.navigate(['/chat', userId]);
  }

  editUser(user: User) {
    // Implementation for editing user
    this.notificationService.show('Edit user functionality coming soon', 'info');
  }

  addUser() {
    if (this.newUser.name && this.newUser.phone && this.newUser.role) {
      const user: User = {
        id: Date.now().toString(),
        name: this.newUser.name,
        phone: this.newUser.phone,
        email: this.newUser.email || '',
        role: this.newUser.role as 'admin' | 'agent' | 'support' | 'patient',
        status: 'active',
        avatar: '',
        messagesCount: 0,
        callsCount: 0,
        createdAt: new Date(),
        lastActivity: new Date()
      };

      this.users.push(user);
      this.filterUsers();
      this.showAddUserForm = false;
      this.resetNewUser();
      this.notificationService.show('User added successfully', 'success');
    }
  }

  resetNewUser() {
    this.newUser = {
      name: '',
      phone: '',
      email: '',
      role: 'patient'
    };
  }
}