export interface ChatMessage {
  id: string;
  customerId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  sender: 'customer' | 'bot' | 'agent';
  timestamp: Date;
  isRead: boolean;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    [key: string]: any;
  };
}