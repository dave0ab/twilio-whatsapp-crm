import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  recentUsers: any[] = [];
  recentOrders: any[] = [];

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.mockDataService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    this.mockDataService.getUsers().subscribe(users => {
      this.recentUsers = users.slice(0, 3);
    });

    this.mockDataService.getOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 3);
    });
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }

  getOrderTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'lab_test': 'science',
      'consultation': 'medical_services',
      'prescription': 'medication',
      'document_upload': 'description'
    };
    return icons[type] || 'assignment';
  }

  getOrderTypeStyle(type: string): string {
    const styles: { [key: string]: string } = {
      'lab_test': 'bg-blue-100 text-blue-600',
      'consultation': 'bg-primary-100 text-primary-600',
      'prescription': 'bg-purple-100 text-purple-600',
      'document_upload': 'bg-orange-100 text-orange-600'
    };
    return styles[type] || 'bg-gray-100 text-gray-600';
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-primary-100 text-primary-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  }
}