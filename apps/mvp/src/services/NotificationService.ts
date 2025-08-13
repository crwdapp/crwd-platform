import { INotificationService } from '../core/interfaces/INotificationService';

/**
 * Concrete implementation of Notification Service
 * Can be easily swapped with different notification libraries
 */
export class NotificationService implements INotificationService {
  success(message: string): void {
    // In a real app, this would use a toast library like react-hot-toast
    console.log('SUCCESS:', message);
    // toast.success(message);
  }

  error(message: string): void {
    console.error('ERROR:', message);
    // toast.error(message);
  }

  warning(message: string): void {
    console.warn('WARNING:', message);
    // toast.warning(message);
  }

  info(message: string): void {
    console.info('INFO:', message);
    // toast.info(message);
  }
}