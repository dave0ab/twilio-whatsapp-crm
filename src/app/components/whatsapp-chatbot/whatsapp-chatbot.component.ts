import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WhatsappChatbotService } from '../../services/whatsapp-chatbot.service';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification.service';
import { Customer } from '../../interfaces/customer.interface';
import { ChatMessage } from '../../interfaces/chat-message.interface';
import { Call } from '../../interfaces/call.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whatsapp-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-chatbot.component.html',
  styleUrls: ['./whatsapp-chatbot.component.scss']
})
export class WhatsappChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  chatMessages: ChatMessage[] = [];
  searchTerm: string = '';
  newMessage: string = '';
  isLoading = false;
  isMobile = false;
  showCustomerList = true;
  
  // Call history integration
  showCallHistoryModal = false;
  selectedCustomerForCalls: Customer | null = null;
  customerCalls: Call[] = [];
  customerMessageCounts: { [customerId: string]: number } = {};
  customerCallCounts: { [customerId: string]: number } = {};
  
  private subscriptions = new Subscription();
  private shouldScrollToBottom = false;

  constructor(
    private whatsappService: WhatsappChatbotService,
    private mockDataService: MockDataService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loadCustomers();
    this.loadCustomerStats();
    
    // Subscribe to selected customer changes
    this.subscriptions.add(
      this.whatsappService.selectedCustomer$.subscribe(customer => {
        this.selectedCustomer = customer;
        if (customer) {
          this.loadChatMessages(customer.id);
          this.markAsRead(customer.id);
          if (this.isMobile) {
            this.showCustomerList = false;
          }
        }
      })
    );

    // Check screen size on window resize
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    window.removeEventListener('resize', this.checkScreenSize);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.showCustomerList = true;
    }
  }

  loadCustomers() {
    this.isLoading = true;
    this.whatsappService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.filteredCustomers = customers;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.show('Error loading customers', 'error');
        this.isLoading = false;
      }
    });
  }

  loadCustomerStats() {
    // Load message and call counts for each customer
    this.mockDataService.getUsers().subscribe(users => {
      users.forEach(user => {
        this.customerMessageCounts[user.id] = user.messagesCount;
        this.customerCallCounts[user.id] = user.callsCount;
      });
    });
  }

  loadChatMessages(customerId: string) {
    this.whatsappService.getChatMessages(customerId).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        this.notificationService.show('Error loading chat messages', 'error');
      }
    });
  }

  selectCustomer(customer: Customer) {
    this.whatsappService.selectCustomer(customer);
  }

  searchCustomers() {
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = this.customers;
      return;
    }

    this.whatsappService.searchCustomers(this.searchTerm).subscribe({
      next: (customers) => {
        this.filteredCustomers = customers;
      },
      error: (error) => {
        this.notificationService.show('Error searching customers', 'error');
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedCustomer) {
      return;
    }

    const messageContent = this.newMessage.trim();
    this.newMessage = '';

    this.whatsappService.sendMessage(this.selectedCustomer.id, messageContent).subscribe({
      next: (message) => {
        this.chatMessages.push(message);
        this.shouldScrollToBottom = true;
        this.notificationService.show('Message sent successfully', 'success');
      },
      error: (error) => {
        this.notificationService.show('Error sending message', 'error');
      }
    });
  }

  markAsRead(customerId: string) {
    this.whatsappService.markMessagesAsRead(customerId).subscribe();
  }

  // Call history methods
  viewCallHistory(customerId: string) {
    const customer = this.customers.find(c => c.id === customerId);
    if (customer) {
      this.selectedCustomerForCalls = customer;
      this.mockDataService.getCallsByUserId(customerId).subscribe(calls => {
        this.customerCalls = calls.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
        this.showCallHistoryModal = true;
      });
    }
  }

  closeCallHistoryModal() {
    this.showCallHistoryModal = false;
    this.selectedCustomerForCalls = null;
    this.customerCalls = [];
  }

  initiateCall(type: 'audio' | 'video') {
    if (this.selectedCustomer) {
      this.notificationService.show(
        `Initiating ${type} call with ${this.selectedCustomer.name}...`, 
        'info'
      );
    }
  }

  initiateQuickCall(customerId: string, type: 'audio' | 'video') {
    const customer = this.customers.find(c => c.id === customerId);
    this.notificationService.show(
      `Initiating ${type} call with ${customer?.name || 'patient'}...`, 
      'info'
    );
  }

  initiateCallFromModal(type: 'audio' | 'video') {
    if (this.selectedCustomerForCalls) {
      this.notificationService.show(
        `Initiating ${type} call with ${this.selectedCustomerForCalls.name}...`, 
        'info'
      );
      this.closeCallHistoryModal();
    }
  }

  // Utility methods
  getCustomerCallCount(customerId: string): number {
    return this.customerCallCounts[customerId] || 0;
  }

  getCustomerMessageCount(customerId: string): number {
    return this.customerMessageCounts[customerId] || 0;
  }

  getMessageStyle(sender: string): string {
    const styles: { [key: string]: string } = {
      'customer': 'bg-gray-100 text-gray-900 ml-0 mr-12',
      'bot': 'bg-blue-500 text-white ml-12 mr-0',
      'agent': 'bg-primary-500 text-white ml-12 mr-0'
    };
    return styles[sender] || 'bg-gray-100 text-gray-900';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'online': 'bg-green-400',
      'offline': 'bg-gray-400',
      'typing': 'bg-yellow-400'
    };
    return colors[status] || 'bg-gray-400';
  }

  getCallStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'completed': 'bg-primary-100 text-primary-800',
      'missed': 'bg-red-100 text-red-800',
      'ongoing': 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  }

  formatDuration(seconds: number): string {
    if (seconds === 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }

  goBackToCustomerList() {
    this.showCustomerList = true;
    this.whatsappService.selectCustomer(null);
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  downloadFile(fileUrl: string, fileName: string) {
    this.notificationService.show(`Downloading ${fileName}...`, 'info');
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const icons: { [key: string]: string } = {
      'pdf': 'picture_as_pdf',
      'doc': 'description',
      'docx': 'description',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'mp3': 'audiotrack',
      'wav': 'audiotrack',
      'mp4': 'videocam',
      'avi': 'videocam'
    };
    return icons[extension || ''] || 'attach_file';
  }
}