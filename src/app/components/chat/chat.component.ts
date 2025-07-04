import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';

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
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.loadUserData();
      this.loadMessages();
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