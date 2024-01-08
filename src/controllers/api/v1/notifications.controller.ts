// notification.controller.ts
import { Request, Response } from 'express';
import NotificationService from '../../../services/notificationservice';
import Xrequest from '../../../interfaces/extensions.interface';

class NotificationController {
  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const { userId, message } = req.body;
      const notificationService = new NotificationService(req.app.get('wss'));
      const notification = await notificationService.createNotification(userId, message);
      res.status(201).json({ status: true, data: notification });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
  }

  async sendNotification(req: Xrequest, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const notificationService = new NotificationService(req.app.get('wss'));
      const success = await notificationService.sendNotification(req.userId!,notificationId);

      if (success) {
        res.json({ status: true, message: 'Notification sent successfully' });
      } else {
        res.json({ status: false, message: 'Failed to send notification' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
  }
}

export default NotificationController;
