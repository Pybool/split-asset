import mongoose, { Document, Schema } from 'mongoose';
import {INotification} from "../interfaces/notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });

const NotificationModel = mongoose.model<Notification>('Notification', notificationSchema);

export default NotificationModel;
