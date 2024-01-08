import WebSocket from 'ws';
import NotificationModel from "../models/notifications.model";

class NotificationService {
  private wss: WebSocket.Server;

  constructor(wss: WebSocket.Server) {
    this.wss = wss;
  }

  async createNotification(userId: string, message: string): Promise<Notification> {
    try {
      const notification = await NotificationModel.create({ userId, message });
      this.sendNotificationToUser(userId, notification); // Send the notification to the user via WebSocket
      return notification;
    } catch (error) {
      throw new Error('Error creating notification');
    }
  }

  private sendNotificationToUser(userId: string, notification: Notification): void {
    this.wss.clients.forEach((client) => {
      if ((client as any).userId === userId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  }

  public async sendNotification(userId: string, notificationId: string): Promise<any> {
    const notification = await NotificationModel.findOne({_id:notificationId})
    if (notification) {
        this.sendNotificationToUser(userId, notification);
      } else {
        return {status:false, message: 'No Notification was found that matches the id provided'}
      }
  }
}

export default NotificationService;
