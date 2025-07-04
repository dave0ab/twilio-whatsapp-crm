import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Customer } from '../interfaces/customer.interface';
import { ChatMessage } from '../interfaces/chat-message.interface';

@Injectable({
  providedIn: 'root'
})
export class WhatsappChatbotService {
  private customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      phone: '+1234567890',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastMessage: {
        content: 'I need help with my prescription refill',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        sender: 'customer'
      },
      unreadCount: 2,
      status: 'online',
      isActive: true,
      tags: ['prescription', 'urgent'],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1234567891',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastMessage: {
        content: 'Thank you for the appointment confirmation',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'text',
        sender: 'customer'
      },
      unreadCount: 0,
      status: 'offline',
      isActive: true,
      tags: ['appointment'],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Michael Brown',
      phone: '+1234567892',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastMessage: {
        content: 'Here are my test results',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'document',
        sender: 'customer'
      },
      unreadCount: 1,
      status: 'typing',
      isActive: true,
      tags: ['lab-results'],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Emily Davis',
      phone: '+1234567893',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastMessage: {
        content: 'Can I schedule a video consultation?',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: 'text',
        sender: 'customer'
      },
      unreadCount: 3,
      status: 'online',
      isActive: true,
      tags: ['consultation', 'video-call'],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '5',
      name: 'Robert Wilson',
      phone: '+1234567894',
      lastMessage: {
        content: 'Bot: Your appointment is confirmed for tomorrow at 2 PM',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        type: 'text',
        sender: 'bot'
      },
      unreadCount: 0,
      status: 'offline',
      isActive: true,
      tags: ['appointment', 'confirmed'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  private chatMessages: { [customerId: string]: ChatMessage[] } = {
    '1': [
      {
        id: '1',
        customerId: '1',
        content: 'Hello, I need help with my prescription refill',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: true
      },
      {
        id: '2',
        customerId: '1',
        content: 'Hi! I can help you with your prescription refill. Can you please provide your prescription number?',
        type: 'text',
        sender: 'bot',
        timestamp: new Date(Date.now() - 29 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        customerId: '1',
        content: 'My prescription number is RX123456',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 28 * 60 * 1000),
        isRead: true
      },
      {
        id: '4',
        customerId: '1',
        content: 'I found your prescription for Metformin. Would you like me to process the refill?',
        type: 'text',
        sender: 'bot',
        timestamp: new Date(Date.now() - 27 * 60 * 1000),
        isRead: true
      },
      {
        id: '5',
        customerId: '1',
        content: 'Yes, please process the refill',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false
      },
      {
        id: '6',
        customerId: '1',
        content: 'When will it be ready for pickup?',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
        isRead: false
      }
    ],
    '2': [
      {
        id: '7',
        customerId: '2',
        content: 'I would like to schedule an appointment',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '8',
        customerId: '2',
        content: 'I can help you schedule an appointment. What type of appointment do you need?',
        type: 'text',
        sender: 'bot',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000),
        isRead: true
      },
      {
        id: '9',
        customerId: '2',
        content: 'General consultation with Dr. Smith',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60 * 1000),
        isRead: true
      },
      {
        id: '10',
        customerId: '2',
        content: 'Your appointment has been scheduled for tomorrow at 3 PM with Dr. Smith.',
        type: 'text',
        sender: 'bot',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: true
      },
      {
        id: '11',
        customerId: '2',
        content: 'Thank you for the appointment confirmation',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: true
      }
    ],
    '3': [
      {
        id: '12',
        customerId: '3',
        content: 'I have my lab results ready',
        type: 'text',
        sender: 'customer',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '13',
        customerId: '3',
        content: 'Great! Please upload your lab results and I\'ll have a doctor review them.',
        type: 'text',
        sender: 'bot',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 30 * 1000),
        isRead: true
      },
      {
        id: '14',
        customerId: '3',
        content: 'Here are my test results',
        type: 'document',
        sender: 'customer',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        fileName: 'lab_results_2024.pdf',
        fileSize: 2048000,
        fileUrl: 'https://example.com/documents/lab_results_2024.pdf'
      }
    ]
  };

  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);
  public selectedCustomer$ = this.selectedCustomerSubject.asObservable();

  getCustomers(): Observable<Customer[]> {
    return of(this.customers).pipe(delay(300));
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return of(this.customers.find(customer => customer.id === id)).pipe(delay(200));
  }

  getChatMessages(customerId: string): Observable<ChatMessage[]> {
    return of(this.chatMessages[customerId] || []).pipe(delay(300));
  }

  selectCustomer(customer: Customer | null) {
    this.selectedCustomerSubject.next(customer);
  }

  markMessagesAsRead(customerId: string): Observable<void> {
    const customer = this.customers.find(c => c.id === customerId);
    if (customer) {
      customer.unreadCount = 0;
    }
    
    const messages = this.chatMessages[customerId];
    if (messages) {
      messages.forEach(msg => {
        if (msg.sender === 'customer') {
          msg.isRead = true;
        }
      });
    }
    
    return of(void 0).pipe(delay(200));
  }

  sendMessage(customerId: string, content: string, type: 'text' | 'image' | 'document' = 'text'): Observable<ChatMessage> {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      customerId,
      content,
      type,
      sender: 'agent',
      timestamp: new Date(),
      isRead: true
    };

    if (!this.chatMessages[customerId]) {
      this.chatMessages[customerId] = [];
    }
    
    this.chatMessages[customerId].push(newMessage);
    
    // Update customer's last message
    const customer = this.customers.find(c => c.id === customerId);
    if (customer) {
      customer.lastMessage = {
        content,
        timestamp: new Date(),
        type,
        sender: 'agent'
      };
      customer.lastActivity = new Date();
    }

    return of(newMessage).pipe(delay(300));
  }

  searchCustomers(query: string): Observable<Customer[]> {
    if (!query.trim()) {
      return this.getCustomers();
    }

    const filtered = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone.includes(query) ||
      customer.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    return of(filtered).pipe(delay(300));
  }

  getUnreadCount(): Observable<number> {
    const total = this.customers.reduce((sum, customer) => sum + customer.unreadCount, 0);
    return of(total);
  }
}