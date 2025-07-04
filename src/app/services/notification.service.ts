import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private toasts$ = new BehaviorSubject<Notification[]>([]);

  getNotifications() {
    return this.notifications$.asObservable();
  }

  getToasts() {
    return this.toasts$.asObservable();
  }

  addNotification(message: string, type: Notification['type'] = 'info') {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    const current = this.notifications$.value;
    this.notifications$.next([notification, ...current]);

    // Also show as toast
    this.showToast(notification);
  }

  show(message: string, type: Notification['type'] = 'info') {
    this.addNotification(message, type);
  }

  private showToast(notification: Notification) {
    const current = this.toasts$.value;
    this.toasts$.next([...current, notification]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      this.removeToast(notification.id);
    }, 5000);
  }

  removeToast(id: string) {
    const current = this.toasts$.value;
    this.toasts$.next(current.filter(toast => toast.id !== id));
  }

  markAsRead(id: string) {
    const current = this.notifications$.value;
    const updated = current.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    this.notifications$.next(updated);
  }

  clearAll() {
    this.notifications$.next([]);
  }
}