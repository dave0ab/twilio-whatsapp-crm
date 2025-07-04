export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage: {
    content: string;
    timestamp: Date;
    type: 'text' | 'image' | 'document' | 'audio' | 'video';
    sender: 'customer' | 'bot' | 'agent';
  };
  unreadCount: number;
  status: 'online' | 'offline' | 'typing';
  isActive: boolean;
  tags?: string[];
  notes?: string;
  createdAt: Date;
  lastActivity: Date;
}