export interface Call {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'audio' | 'video';
  duration: number;
  startTime: Date;
  endTime?: Date;
  status: 'completed' | 'missed' | 'ongoing';
  notes?: string;
}