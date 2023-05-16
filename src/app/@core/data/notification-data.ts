export interface Notification {
    
}
  
export abstract class NotificationData {
    abstract getData(): any[];
    abstract getNotification(notificationId: string): Promise<any>;
    abstract readNotification(notificationId: string): Promise<any>;
    abstract readAllNotifications(notificationArray: any): Promise<any>;
    abstract getCheckNotification(): Promise<any>;
    abstract getNotificationUsers(notificationId: string): Promise<any>;
    abstract getNotifications(): Promise<any>;
}
  