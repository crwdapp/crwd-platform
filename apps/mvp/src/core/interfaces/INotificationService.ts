/**
 * Notification service interface
 * Abstracts notification operations
 */
export interface INotificationService {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
}