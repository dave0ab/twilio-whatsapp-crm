import { Component, OnInit, HostListener } from '@angular/core';
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
  paginatedOrders: Order[] = [];
  selectedOrder: Order | null = null;
  
  // Filters
  searchTerm: string = '';
  typeFilter: string = '';
  statusFilter: string = '';
  priorityFilter: string = '';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  
  // View and sorting
  viewMode: 'table' | 'card' = 'table';
  sortField: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // UI state
  activeDropdown: string | null = null;
  isLoading: boolean = false;

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.activeDropdown = null;
  }

  loadOrders() {
    this.isLoading = true;
    this.mockDataService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.show('Error loading orders', 'error');
        this.isLoading = false;
      }
    });
  }

  filterOrders() {
    let filtered = [...this.orders];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.title.toLowerCase().includes(term) ||
        order.userName.toLowerCase().includes(term) ||
        order.userPhone.includes(term) ||
        order.description.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (this.typeFilter) {
      filtered = filtered.filter(order => order.type === this.typeFilter);
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Apply priority filter
    if (this.priorityFilter) {
      filtered = filtered.filter(order => order.priority === this.priorityFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Order];
      let bValue: any = b[this.sortField as keyof Order];

      if (this.sortField === 'createdAt' || this.sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredOrders = filtered;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterOrders();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  clearFilters() {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.currentPage = 1;
    this.filterOrders();
    this.notificationService.show('Filters cleared', 'info');
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'card' : 'table';
  }

  refreshOrders() {
    this.loadOrders();
    this.notificationService.show('Orders refreshed', 'success');
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Modal methods
  openOrderModal(order: Order) {
    this.selectedOrder = order;
    document.body.style.overflow = 'hidden';
  }

  closeOrderModal() {
    this.selectedOrder = null;
    document.body.style.overflow = 'auto';
  }

  // Action methods
  updateStatus(orderId: string, newStatus: Order['status']) {
    this.mockDataService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.filterOrders();
          this.notificationService.show(
            `Order ${updatedOrder.title} status updated to ${newStatus.replace('_', ' ')}`, 
            'success'
          );
        }
      },
      error: () => {
        this.notificationService.show('Error updating order status', 'error');
      }
    });
  }

  updateStatusAndClose(orderId: string, newStatus: Order['status']) {
    this.updateStatus(orderId, newStatus);
    if (this.selectedOrder && this.selectedOrder.id === orderId) {
      this.selectedOrder = { 
        ...this.selectedOrder, 
        status: newStatus, 
        updatedAt: new Date() 
      };
      if (newStatus === 'completed') {
        this.selectedOrder.completedAt = new Date();
      }
    }
  }

  toggleDropdown(orderId: string) {
    this.activeDropdown = this.activeDropdown === orderId ? null : orderId;
  }

  editOrder(order: Order) {
    this.activeDropdown = null;
    this.notificationService.show('Edit order functionality coming soon', 'info');
  }

  duplicateOrder(order: Order) {
    this.activeDropdown = null;
    this.notificationService.show('Duplicate order functionality coming soon', 'info');
  }

  createNewOrder() {
    this.notificationService.show('Create new order functionality coming soon', 'info');
  }

  exportOrders() {
    this.notificationService.show('Export functionality coming soon', 'info');
  }

  // Utility methods
  getOrderStats() {
    return {
      total: this.orders.length,
      pending: this.orders.filter(o => o.status === 'pending').length,
      inProgress: this.orders.filter(o => o.status === 'in_progress').length,
      completed: this.orders.filter(o => o.status === 'completed').length,
      cancelled: this.orders.filter(o => o.status === 'cancelled').length
    };
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
      'lab_test': 'bg-blue-100 text-blue-800 border border-blue-200',
      'consultation': 'bg-primary-100 text-primary-800 border border-primary-200',
      'prescription': 'bg-purple-100 text-purple-800 border border-purple-200',
      'document_upload': 'bg-orange-100 text-orange-800 border border-orange-200'
    };
    return styles[type] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'in_progress': 'bg-blue-100 text-blue-800 border border-blue-200',
      'completed': 'bg-primary-100 text-primary-800 border border-primary-200',
      'cancelled': 'bg-red-100 text-red-800 border border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getStatusDotColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-400',
      'in_progress': 'bg-blue-400',
      'completed': 'bg-primary-400',
      'cancelled': 'bg-red-400'
    };
    return colors[status] || 'bg-gray-400';
  }

  getPriorityStyle(priority: string): string {
    const styles: { [key: string]: string } = {
      'low': 'bg-gray-100 text-gray-800 border border-gray-200',
      'medium': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'high': 'bg-red-100 text-red-800 border border-red-200'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  // Expose Math for template
  Math = Math;
}