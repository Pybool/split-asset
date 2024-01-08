import NotificationModel from "../models/notifications.model";

class NotificationService {
  async createNotification(userId: string, message: string): Promise<Notification> {
    try {
      const notification = await NotificationModel.create({ userId, message });
      return notification;
    } catch (error) {
      throw new Error('Error creating notification');
    }
  }

  async sendNotification(notificationId: string): Promise<boolean> {
    try {
      console.log(`Notification sent for ID: ${notificationId}`);
      return true;
    } catch (error) {
      throw new Error('Error sending notification');
    }
  }
}

export default NotificationService;
