import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { Call } from '../interfaces/call.interface';
import { Message } from '../interfaces/message.interface';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      role: 'patient',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastSeen: new Date(Date.now() - 2 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      messagesCount: 45,
      callsCount: 3
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1234567891',
      email: 'sarah@example.com',
      role: 'patient',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastSeen: new Date(Date.now() - 10 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      messagesCount: 23,
      callsCount: 1
    },
    {
      id: '3',
      name: 'Dr. Mike Wilson',
      phone: '+1234567892',
      email: 'mike@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      lastSeen: new Date(Date.now() - 1 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      messagesCount: 156,
      callsCount: 12
    }
  ];

  private calls: Call[] = [
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      userAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      type: 'audio',
      duration: 480,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 480 * 1000),
      status: 'completed',
      notes: 'Patient consultation about test results'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      type: 'video',
      duration: 0,
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'missed',
      notes: 'Patient did not answer'
    }
  ];

  private messages: Message[] = [
    {
      id: '1',
      userId: '1',
      content: 'Hello, I need help with my test results.',
      type: 'text',
      sender: 'user',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true
    },
    {
      id: '2',
      userId: '1',
      content: 'Hi! I\'ll help you with your test results. Can you please share your report?',
      type: 'text',
      sender: 'bot',
      timestamp: new Date(Date.now() - 29 * 60 * 1000),
      isRead: true
    },
    {
      id: '3',
      userId: '1',
      content: 'Here is my blood test report',
      type: 'document',
      sender: 'user',
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      fileName: 'blood_test_report.pdf',
      fileSize: 1024000,
      fileUrl: 'https://example.com/documents/blood_test_report.pdf',
      isRead: true
    }
  ];

  private orders: Order[] = [
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      userPhone: '+1234567890',
      type: 'lab_test',
      title: 'Complete Blood Count',
      description: 'Routine blood test for annual checkup',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedTo: 'Dr. Mike Wilson',
      amount: 150
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Johnson',
      userPhone: '+1234567891',
      type: 'consultation',
      title: 'Dermatology Consultation',
      description: 'Skin condition consultation',
      status: 'pending',
      priority: 'high',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      amount: 200
    }
  ];

  private dashboardStats = {
    totalMessages: 1247,
    totalCalls: 89,
    totalFiles: 234,
    totalOrders: 156,
    newUsers: 12,
    activeUsers: 45
  };

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500));
  }

  getCalls(): Observable<Call[]> {
    return of(this.calls).pipe(delay(500));
  }

  getMessages(userId: string): Observable<Message[]> {
    return of(this.messages.filter(msg => msg.userId === userId)).pipe(delay(500));
  }

  getOrders(): Observable<Order[]> {
    return of(this.orders).pipe(delay(500));
  }

  getDashboardStats(): Observable<any> {
    return of(this.dashboardStats).pipe(delay(500));
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(this.users.find(user => user.id === id)).pipe(delay(300));
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      if (status === 'completed') {
        order.completedAt = new Date();
      }
    }
    return of(order!).pipe(delay(500));
  }

  createUser(userData: Partial<User>): Observable<User> {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      name: userData.name || '',
      phone: userData.phone || '',
      email: userData.email,
      role: userData.role || 'patient',
      status: 'active',
      avatar: userData.avatar,
      createdAt: new Date(),
      messagesCount: 0,
      callsCount: 0
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }
}