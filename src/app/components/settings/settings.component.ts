import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings = {
    notifications: {
      newUsers: true,
      messages: true,
      missedCalls: true
    },
    fileUpload: {
      maxSize: 10,
      allowedTypes: {
        pdf: true,
        images: true,
        documents: true
      }
    },
    templates: {
      welcome: 'Welcome to our healthcare service! How can I help you today?',
      outOfOffice: 'Thank you for your message. We are currently out of office but will respond as soon as possible.'
    },
    system: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    }
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('healthcareAdminSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings() {
    localStorage.setItem('healthcareAdminSettings', JSON.stringify(this.settings));
    this.notificationService.addNotification('Settings saved successfully!', 'success');
  }
}