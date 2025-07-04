import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WhatsappChatbotService } from '../../services/whatsapp-chatbot.service';
import { NotificationService } from '../../services/notification.service';
import { Customer } from '../../interfaces/customer.interface';
import { ChatMessage } from '../../interfaces/chat-message.interface';
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
  
  private subscriptions = new Subscription();
  private shouldScrollToBottom = false;

  constructor(
    private whatsappService: WhatsappChatbotService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loadCustomers();
    
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
    // In a real implementation, this would handle file downloads
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