import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeToast(id: string) {
    this.notificationService.removeToast(id);
  }

  getToastStyle(type: string): string {
    const styles: { [key: string]: string } = {
      'success': 'bg-primary-50 text-primary-800 border-primary-200',
      'error': 'bg-red-50 text-red-800 border-red-200',
      'warning': 'bg-yellow-50 text-yellow-800 border-yellow-200',
      'info': 'bg-blue-50 text-blue-800 border-blue-200'
    };
    return styles[type] || 'bg-gray-50 text-gray-800 border-gray-200';
  }

  getToastIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }
}