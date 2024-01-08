import { Document } from 'mongoose';

export interface INotification extends Document {
  userId: Object;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

