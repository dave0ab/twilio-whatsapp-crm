export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: 'lab_test' | 'consultation' | 'prescription' | 'document_upload';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedTo?: string;
  notes?: string;
  amount?: number;
}