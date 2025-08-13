import { IBarRepository } from './interfaces/IBarRepository';
import { ILocationService } from './interfaces/ILocationService';
import { INotificationService } from './interfaces/INotificationService';
import { BarRepository } from '../repositories/BarRepository';
import { LocationService } from '../services/LocationService';
import { NotificationService } from '../services/NotificationService';

/**
 * Dependency Injection Container
 * Implements Dependency Injection pattern for loose coupling
 * Follows Single Responsibility Principle
 */
export class DependencyContainer {
  private static instance: DependencyContainer;
  private services = new Map<string, any>();

  private constructor() {
    this.registerServices();
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private registerServices(): void {
    // Register repositories
    this.services.set('IBarRepository', new BarRepository());
    
    // Register services
    this.services.set('ILocationService', new LocationService());
    this.services.set('INotificationService', new NotificationService());
  }

  get<T>(serviceKey: string): T {
    const service = this.services.get(serviceKey);
    if (!service) {
      throw new Error(`Service ${serviceKey} not found`);
    }
    return service;
  }

  register<T>(serviceKey: string, implementation: T): void {
    this.services.set(serviceKey, implementation);
  }
}

// Convenience functions for common services
export const getBarRepository = (): IBarRepository => 
  DependencyContainer.getInstance().get<IBarRepository>('IBarRepository');

export const getLocationService = (): ILocationService => 
  DependencyContainer.getInstance().get<ILocationService>('ILocationService');

export const getNotificationService = (): INotificationService => 
  DependencyContainer.getInstance().get<INotificationService>('INotificationService');