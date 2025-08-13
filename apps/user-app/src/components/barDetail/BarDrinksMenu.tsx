import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Bar } from '../../types/bar';

const { width: screenWidth } = Dimensions.get('window');

interface BarDrinksMenuProps {
  availableDrinksMenu: Bar['availableDrinksMenu'];
  availableDrinksCount: number;
  onDrinkSelect: (drinkId: number) => void;
}

export const BarDrinksMenu: React.FC<BarDrinksMenuProps> = ({
  availableDrinksMenu,
  availableDrinksCount,
  onDrinkSelect
}) => {
  if (availableDrinksMenu.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Icon name="wine" size={20} color="#5bc0be" />
          <Text style={styles.sectionTitle}>Available Drinks ({availableDrinksCount} remaining today)</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No drinks available at the moment</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Drinks ({availableDrinksCount} remaining today)</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        snapToInterval={screenWidth * 0.65 + 16} // Card width + gap
        decelerationRate="fast"
      >
        {availableDrinksMenu.map((drink, index) => (
          <TouchableOpacity
            key={drink.id}
            style={styles.drinkCard}
            onPress={() => onDrinkSelect(drink.id)}
          >
            {/* Drink Image */}
            <View style={styles.drinkImageContainer}>
              <Image 
                source={{ uri: drink.image ?? 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop' }}
                style={styles.drinkImage}
              />
              <View style={styles.drinkImageOverlay} />
              
              {/* Category Badge */}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{drink.category}</Text>
              </View>
              
              {/* Price Badge */}
              {drink.originalPrice && (
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>{drink.originalPrice}</Text>
                </View>
              )}
            </View>
            
            {/* Drink Info */}
            <View style={styles.drinkInfo}>
              <Text style={styles.drinkName} numberOfLines={1}>{drink.name}</Text>
              <Text style={styles.drinkDescription} numberOfLines={2}>{drink.description}</Text>
              
              {/* Ingredients Section */}
              <View style={styles.ingredientsSection}>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
                <Text style={styles.ingredientsText}>Premium spirits, natural mixers, fresh garnishes</Text>
                <View style={styles.alcoholDetails}>
                  {drink.alcoholContent && (
                    <Text style={styles.alcoholDetailText}>{drink.alcoholContent}</Text>
                  )}
                  {drink.volume && drink.alcoholContent && (
                    <Text style={styles.alcoholDetailText}> • </Text>
                  )}
                  {drink.volume && (
                    <Text style={styles.alcoholDetailText}>{drink.volume}</Text>
                  )}
                </View>
              </View>
              
              {/* Select Button */}
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => onDrinkSelect(drink.id)}
              >
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  scrollView: {
    marginHorizontal: -20,
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  drinkCard: {
    width: screenWidth * 0.65,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    backdropFilter: 'blur(20px)',
  },
  drinkImageContainer: {
    height: screenWidth * 0.65,
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  drinkImage: {
    width: '100%',
    height: '100%',
  },
  drinkImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(2px)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(91, 192, 190, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5bc0be',
  },
  drinkInfo: {
    padding: 16,
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  drinkDescription: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 14,
  },
  ingredientsSection: {
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ingredientsText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 14,
    marginBottom: 6,
  },
  alcoholDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  alcoholDetailText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  drinkDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  drinkDetailText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectButton: {
    backgroundColor: '#5bc0be',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#5bc0be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
});
