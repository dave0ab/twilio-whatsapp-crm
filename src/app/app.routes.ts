import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'whatsapp-chatbot', 
    loadComponent: () => import('./components/whatsapp-chatbot/whatsapp-chatbot.component').then(m => m.WhatsappChatbotComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'users', 
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'calls', 
    loadComponent: () => import('./components/calls/calls.component').then(m => m.CallsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'chat/:userId', 
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];