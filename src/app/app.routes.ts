import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'whatsapp-chatbot', 
    loadComponent: () => import('./components/whatsapp-chatbot/whatsapp-chatbot.component').then(m => m.WhatsappChatbotComponent) 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent) 
  },
  { 
    path: 'calls', 
    loadComponent: () => import('./components/calls/calls.component').then(m => m.CallsComponent) 
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { 
    path: 'chat/:userId', 
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
];