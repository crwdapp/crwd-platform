import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import { SearchResult } from '../services/searchService';
import { useSearchAnalytics } from '../hooks/useSearch';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { trackSearch } = useSearchAnalytics();

  const handleResultPress = (result: SearchResult) => {
    // Track the search result selection
    trackSearch(result.name, 1);

    if (result.type === 'bar') {
      const barId = parseInt(result.id.split('-')[1]);
      navigation.navigate('BarDetail' as never, { barId } as never);
    } else if (result.type === 'cocktail' && result.barId) {
      const barId = result.barId;
      const drinkId = parseInt(result.id.split('-')[1]);
      navigation.navigate('BarDetail' as never, { 
        barId, 
        drinkId,
        highlightDrink: true 
      } as never);
    } else if (result.type === 'event' && result.barId) {
      const barId = result.barId;
      navigation.navigate('BarDetail' as never, { 
        barId,
        showEvents: true 
      } as never);
    }
  };

  const handleSearchSubmit = (query: string) => {
    // Track search submission
    trackSearch(query, 0);
    console.log('Search submitted:', query);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>
          Find bars, cocktails, and events near you
        </Text>
      </View>

      <SearchBar
        onResultPress={handleResultPress}
        onSearchSubmit={handleSearchSubmit}
        placeholder="Search bars, cocktails, events..."
        showCategories={true}
        autoFocus={true}
        style={styles.searchBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  searchBar: {
    flex: 1,
  },
});

export default SearchScreen;
