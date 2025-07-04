export interface Message {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  isRead: boolean;
}