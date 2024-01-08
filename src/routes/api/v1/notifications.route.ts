import { Router } from 'express';
import NotificationController from '../../../controllers/api/v1/notifications.controller';
const router = Router();
const notificationController = new NotificationController()

router.post('/notifications', notificationController.createNotification);
router.post('/notifications/:notificationId/send', notificationController.sendNotification);

export default router;

/*
Create Notification: (POST)

http://localhost:3000/api/v1/notifications 
Body: {
    "userId": "6595bb9b8e3928e112158544",
    "message": "Hello ,you have a new message"
}

Send Notification: (POST)
http://localhost:3000/api/v1/notifications/659becb84c1762c4c82f27c1/send

WSS Connection: (WS)
ws://localhost:3000?userId=6595bb9b8e3928e112158544

*/


