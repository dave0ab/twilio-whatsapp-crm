import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  searchTerm: string = '';
  typeFilter: string = '';
  statusFilter: string = '';
  priorityFilter: string = '';

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.mockDataService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.filteredOrders = orders;
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.userPhone.includes(this.searchTerm) ||
                           order.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.typeFilter || order.type === this.typeFilter;
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      const matchesPriority = !this.priorityFilter || order.priority === this.priorityFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }

  openOrderModal(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderModal() {
    this.selectedOrder = null;
  }

  updateStatus(orderId: string, newStatus: Order['status']) {
    this.mockDataService.updateOrderStatus(orderId, newStatus).subscribe(updatedOrder => {
      const index = this.orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        this.orders[index] = updatedOrder;
        this.filterOrders();
        this.notificationService.addNotification(
          `Order ${updatedOrder.title} status updated to ${newStatus.replace('_', ' ')}`, 
          'success'
        );
      }
    });
  }

  updateStatusAndClose(orderId: string, newStatus: Order['status']) {
    this.updateStatus(orderId, newStatus);
    // Update the selected order if it's the same one
    if (this.selectedOrder && this.selectedOrder.id === orderId) {
      this.selectedOrder = { ...this.selectedOrder, status: newStatus, updatedAt: new Date() };
      if (newStatus === 'completed') {
        this.selectedOrder.completedAt = new Date();
      }
    }
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
      'lab_test': 'bg-blue-100 text-blue-800',
      'consultation': 'bg-primary-100 text-primary-800',
      'prescription': 'bg-purple-100 text-purple-800',
      'document_upload': 'bg-orange-100 text-orange-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
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

  getPriorityStyle(priority: string): string {
    const styles: { [key: string]: string } = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  }
}