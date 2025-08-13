import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
  totalItems: number;
  currentIndex: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalItems,
  currentIndex,
}) => {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index === currentIndex && styles.progressDotActive
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    gap: 4,
  },
  progressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressDotActive: {
    width: 12,
    backgroundColor: '#5bc0be',
  },
});
