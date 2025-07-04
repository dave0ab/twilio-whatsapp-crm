export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'agent' | 'support' | 'patient';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastSeen?: Date;
  createdAt: Date;
  messagesCount: number;
  callsCount: number;
  lastActivity?: Date;
}