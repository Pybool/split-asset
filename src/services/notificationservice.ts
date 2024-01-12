import WebSocket from 'ws';
import NotificationModel from "../models/notifications.model";
import { decodeToken} from '../middlewares/jwt';
import logger from '../logger';

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
    try{
      this.wss.clients.forEach(async(client) => {
        const WS_TOKEN = (client as any).token as string
        const result = await decodeToken(WS_TOKEN) as any;
        if(result.status){
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(notification));
          }
        }
        else{
          console.log(401)
          const unAuthMessageObject = {status:false, message: 'Invalid or expired token'}
          client.send(JSON.stringify(unAuthMessageObject));
        }
      });
    }catch(error:any){
      logger.error("error");
    }
  }

  public async sendNotification(userId: string, notificationId: string): Promise<any> {
    try{
      const notification = await NotificationModel.findOne({_id:notificationId})
      if (notification) {
          this.sendNotificationToUser(userId, notification);
          return {status:true, message: 'Notification sent'}
        } 
      else {
          return {status:false, message: 'No Notification was found that matches the id provided'}
      }
    }
    catch(error:any){
      logger.error("error");
    }
  }
}

export default NotificationService;
