import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { Call } from '../../interfaces/call.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  user: User | null = null;
  messages: Message[] = [];
  userCalls: Call[] = [];
  userId: string = '';
  showCallHistory: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.loadUserData();
      this.loadMessages();
      this.loadUserCalls();
    });
  }

  loadUserData() {
    this.mockDataService.getUserById(this.userId).subscribe(user => {
      this.user = user || null;
    });
  }

  loadMessages() {
    this.mockDataService.getMessages(this.userId).subscribe(messages => {
      this.messages = messages;
    });
  }

  loadUserCalls() {
    this.mockDataService.getCallsByUserId(this.userId).subscribe(calls => {
      this.userCalls = calls.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    });
  }

  viewCallHistory() {
    this.showCallHistory = true;
  }

  hideCallHistory() {
    this.showCallHistory = false;
  }

  initiateCall(type: 'audio' | 'video') {
    this.notificationService.show(
      `Initiating ${type} call with ${this.user?.name || 'patient'}...`, 
      'info'
    );
    // In a real app, this would integrate with a calling service
  }

  formatDuration(seconds: number): string {
    if (seconds === 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getCallStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'completed': 'bg-primary-100 text-primary-800',
      'missed': 'bg-red-100 text-red-800',
      'ongoing': 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  }

  getMessageStyle(sender: string): string {
    const styles: { [key: string]: string } = {
      'user': 'bg-gray-100 text-gray-900',
      'bot': 'bg-gradient-imarlet text-white',
      'agent': 'bg-blue-600 text-white'
    };
    return styles[sender] || 'bg-gray-100 text-gray-900';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}