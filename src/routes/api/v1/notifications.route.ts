import { Router } from 'express';
import NotificationController from '../../../controllers/api/v1/notifications.controller';
const router = Router();
const notificationController = new NotificationController()

router.post('/notifications', notificationController.createNotification);
router.post('/notifications/:notificationId/send', notificationController.sendNotification);

export default router;