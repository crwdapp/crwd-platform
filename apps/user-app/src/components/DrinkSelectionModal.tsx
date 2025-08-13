import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppStore } from '../store';
import { allDrinks, getDrinksByBarId, Drink } from '../data/drinks';

interface DrinkSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onDrinkSelect: (drinkId: number) => void;
  barId?: number; // Optional barId to filter drinks
}

type ModalStep = 'drinks' | 'token-selection' | 'code';

export const DrinkSelectionModal: React.FC<DrinkSelectionModalProps> = ({ 
  visible, 
  onClose, 
  onDrinkSelect,
  barId 
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('drinks');
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [selectedTokenType, setSelectedTokenType] = useState<'daily' | 'weekly' | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [slideAnim] = useState(new Animated.Value(0));
  
  const { user, getTokenCount, useToken, checkAndResetTokens } = useAppStore();
  
  // Get drinks for the specific bar or all drinks if no barId
  const availableDrinks = barId ? getDrinksByBarId(barId) : allDrinks.filter(drink => drink.isAvailable);
  
  // Check and reset tokens when modal opens
  useEffect(() => {
    if (visible) {
      checkAndResetTokens();
      setCurrentStep('drinks');
      setSelectedDrink(null);
      setSelectedTokenType(null);
      setGeneratedCode('');
      setTimeLeft(60);
    }
  }, [visible, checkAndResetTokens]);
  
  const tokenCount = getTokenCount();

  const handleDrinkSelect = (drink: Drink) => {
    setSelectedDrink(drink);
    setCurrentStep('token-selection');
    // Animate bottom sheet up
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleTokenSelect = (tokenType: 'daily' | 'weekly') => {
    setSelectedTokenType(tokenType);
    setCurrentStep('code');
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setTimeLeft(60);
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Consume token
    const tokenUsed = useToken(tokenType);
    if (tokenUsed) {
      console.log(`Used ${tokenType} token for drink:`, selectedDrink?.name);
    }
  };

  const handleClose = () => {
    setCurrentStep('drinks');
    setSelectedDrink(null);
    setSelectedTokenType(null);
    setGeneratedCode('');
    setTimeLeft(60);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    onClose();
  };

  const calculateDiscountedPrice = (originalPrice: string) => {
    const price = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
    if (selectedTokenType === 'daily') {
      return (price * 0.5).toFixed(2); // 50% off with daily token
    } else if (selectedTokenType === 'weekly') {
      return '0'; // Free with weekly token
    }
    return originalPrice; // No discount
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  const getPriceDisplay = (drink: Drink) => {
    if (!drink.originalPrice) return '';
    
    if (selectedDrink?.id === drink.id && selectedTokenType) {
      const discountedPrice = calculateDiscountedPrice(drink.originalPrice);
      return discountedPrice === '0' ? 'FREE' : `${drink.originalPrice.split(' ')[0]} ${drink.originalPrice.split(' ')[1]}`;
    }
    
    return drink.originalPrice;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {currentStep === 'drinks' && 'Available Drinks'}
              {currentStep === 'token-selection' && 'Select Token'}
              {currentStep === 'code' && 'Your Code'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Token Status */}
          <View style={styles.tokenStatus}>
            <View style={styles.tokenItem}>
              <Text style={styles.tokenLabel}>Daily Tokens:</Text>
              <Text style={styles.tokenCount}>{tokenCount.daily}</Text>
            </View>
            <View style={styles.tokenItem}>
              <Text style={styles.tokenLabel}>Weekly Tokens:</Text>
              <Text style={styles.tokenCount}>{tokenCount.weekly}</Text>
            </View>
          </View>

          {/* Drinks List */}
          {currentStep === 'drinks' && (
            <ScrollView style={styles.drinksList} showsVerticalScrollIndicator={false}>
              {availableDrinks.map((drink) => (
                <View key={drink.id} style={styles.drinkCard}>
                  <Image 
                    source={{ uri: drink.image ?? 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
                    style={styles.drinkImage} 
                  />
                  <View style={styles.drinkContent}>
                    <View style={styles.drinkHeader}>
                      <Text style={styles.drinkName}>{drink.name}</Text>
                      <Text style={styles.drinkPrice}>{getPriceDisplay(drink)}</Text>
                    </View>
                    <Text style={styles.drinkCategory}>{drink.category}</Text>
                    <Text style={styles.drinkDescription}>{drink.description}</Text>
                    
                    {drink.ingredients && drink.ingredients.length > 0 && (
                      <View style={styles.ingredientsContainer}>
                        <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                        <View style={styles.ingredientsList}>
                          {drink.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientTag}>
                              <Text style={styles.ingredientText}>{ingredient}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    {drink.tags && drink.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        <View style={styles.tagsList}>
                          {drink.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => handleDrinkSelect(drink)}
                    >
                      <Text style={styles.selectButtonText}>Select Drink</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Token Selection Bottom Sheet */}
          {currentStep === 'token-selection' && (
            <Animated.View 
              style={[
                styles.bottomSheet,
                {
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    })
                  }]
                }
              ]}
            >
              <View style={styles.bottomSheetHeader}>
                <View style={styles.bottomSheetHandle} />
                <Text style={styles.bottomSheetTitle}>Apply Token Discount</Text>
              </View>
              
              <View style={styles.tokenButtons}>
                {tokenCount.daily > 0 && (
                  <TouchableOpacity
                    style={styles.tokenButton}
                    onPress={() => handleTokenSelect('daily')}
                  >
                    <Icon name="gift" size={20} color="#5bc0be" />
                    <Text style={styles.tokenButtonText}>Daily Token (50% OFF)</Text>
                    <Text style={styles.tokenButtonPrice}>
                      {selectedDrink?.originalPrice ? calculateDiscountedPrice(selectedDrink.originalPrice) : '50% OFF'}
                    </Text>
                  </TouchableOpacity>
                )}
                {tokenCount.weekly > 0 && (
                  <TouchableOpacity
                    style={styles.tokenButton}
                    onPress={() => handleTokenSelect('weekly')}
                  >
                    <Icon name="gift" size={20} color="#5bc0be" />
                    <Text style={styles.tokenButtonText}>Weekly Token (FREE)</Text>
                    <Text style={styles.tokenButtonPrice}>FREE</Text>
                  </TouchableOpacity>
                )}
                {tokenCount.daily === 0 && tokenCount.weekly === 0 && (
                  <View style={styles.noTokensContainer}>
                    <Icon name="alert-circle" size={24} color="#888" />
                    <Text style={styles.noTokensText}>No tokens available</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          {/* Code Display */}
          {currentStep === 'code' && (
            <View style={styles.codeContainer}>
              <View style={styles.codeHeader}>
                <Icon name="smartphone" size={32} color="#5bc0be" />
                <Text style={styles.codeTitle}>Show to Bartender</Text>
              </View>
              
              <View style={styles.codeDisplay}>
                <Text style={styles.codeText}>{generatedCode}</Text>
                <Text style={styles.codeSubtext}>Valid for {formatTime(timeLeft)}s</Text>
              </View>
              
              <View style={styles.codeInfo}>
                <Text style={styles.codeInfoText}>
                  Present this code to the bartender to redeem your {selectedTokenType} token discount.
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  tokenStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(111, 255, 233, 0.1)',
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 12,
    marginBottom: 20,
  },
  tokenItem: {
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: 12,
    color: '#5bc0be',
    fontWeight: '500',
  },
  tokenCount: {
    fontSize: 18,
    color: '#5bc0be',
    fontWeight: 'bold',
  },
  drinksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  drinkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drinkImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  drinkContent: {
    padding: 24,
  },
  drinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  drinkName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: 0.5,
  },
  drinkPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5bc0be',
  },
  drinkCategory: {
    fontSize: 16,
    color: '#5bc0be',
    marginBottom: 16,
    fontWeight: '600',
  },
  drinkDescription: {
    fontSize: 16,
    color: '#D0D8E0',
    lineHeight: 24,
    marginBottom: 20,
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: 'rgba(91, 192, 190, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(91, 192, 190, 0.3)',
  },
  ingredientText: {
    fontSize: 14,
    color: '#5bc0be',
    fontWeight: '600',
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#D0D8E0',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#5bc0be',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tokenButtons: {
    gap: 12,
  },
  tokenButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  tokenButtonPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5bc0be',
  },
  noTokensContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noTokensText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  codeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  codeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  codeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
  },
  codeDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  codeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#5bc0be',
    letterSpacing: 8,
    marginBottom: 8,
  },
  codeSubtext: {
    fontSize: 14,
    color: '#888',
  },
  codeInfo: {
    alignItems: 'center',
  },
  codeInfoText: {
    fontSize: 14,
    color: '#D0D8E0',
    textAlign: 'center',
    lineHeight: 20,
  },
});

