import AsyncStorage from '@react-native-async-storage/async-storage';

export type InteractionType = 'saved' | 'interested' | 'going';

interface UserInteraction {
  eventId: number;
  type: InteractionType;
  timestamp: string;
}

class UserInteractionService {
  private static readonly STORAGE_KEY = 'user_event_interactions';

  // Get all user interactions
  async getUserInteractions(): Promise<UserInteraction[]> {
    try {
      const data = await AsyncStorage.getItem(UserInteractionService.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user interactions:', error);
      return [];
    }
  }

  // Add or update an interaction
  async addInteraction(eventId: number, type: InteractionType): Promise<void> {
    try {
      const interactions = await this.getUserInteractions();
      
      // Remove existing interaction for this event and type
      const filteredInteractions = interactions.filter(
        interaction => !(interaction.eventId === eventId && interaction.type === type)
      );

      // Add new interaction
      const newInteraction: UserInteraction = {
        eventId,
        type,
        timestamp: new Date().toISOString()
      };

      const updatedInteractions = [...filteredInteractions, newInteraction];
      await AsyncStorage.setItem(
        UserInteractionService.STORAGE_KEY, 
        JSON.stringify(updatedInteractions)
      );
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  }

  // Remove an interaction
  async removeInteraction(eventId: number, type: InteractionType): Promise<void> {
    try {
      const interactions = await this.getUserInteractions();
      const filteredInteractions = interactions.filter(
        interaction => !(interaction.eventId === eventId && interaction.type === type)
      );

      await AsyncStorage.setItem(
        UserInteractionService.STORAGE_KEY, 
        JSON.stringify(filteredInteractions)
      );
    } catch (error) {
      console.error('Error removing interaction:', error);
    }
  }

  // Check if user has a specific interaction with an event
  async hasInteraction(eventId: number, type: InteractionType): Promise<boolean> {
    try {
      const interactions = await this.getUserInteractions();
      return interactions.some(
        interaction => interaction.eventId === eventId && interaction.type === type
      );
    } catch (error) {
      console.error('Error checking interaction:', error);
      return false;
    }
  }

  // Get all event IDs that user has any interaction with
  async getInteractedEventIds(): Promise<number[]> {
    try {
      const interactions = await this.getUserInteractions();
      const eventIds = interactions.map(interaction => interaction.eventId);
      return [...new Set(eventIds)]; // Remove duplicates
    } catch (error) {
      console.error('Error getting interacted event IDs:', error);
      return [];
    }
  }

  // Get interactions by type
  async getInteractionsByType(type: InteractionType): Promise<number[]> {
    try {
      const interactions = await this.getUserInteractions();
      return interactions
        .filter(interaction => interaction.type === type)
        .map(interaction => interaction.eventId);
    } catch (error) {
      console.error('Error getting interactions by type:', error);
      return [];
    }
  }

  // Toggle an interaction (add if not exists, remove if exists)
  async toggleInteraction(eventId: number, type: InteractionType): Promise<boolean> {
    try {
      const hasInteraction = await this.hasInteraction(eventId, type);
      
      if (hasInteraction) {
        await this.removeInteraction(eventId, type);
        return false; // Removed
      } else {
        await this.addInteraction(eventId, type);
        return true; // Added
      }
    } catch (error) {
      console.error('Error toggling interaction:', error);
      return false;
    }
  }

  // Clear all interactions (for testing/reset)
  async clearAllInteractions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(UserInteractionService.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing interactions:', error);
    }
  }
}

export const userInteractionService = new UserInteractionService();