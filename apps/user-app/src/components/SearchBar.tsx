import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSearch, SearchCategory } from '../hooks/useSearch';
import { SearchResult } from '../services/searchService';

const { width } = Dimensions.get('window');

interface SearchBarProps {
  onResultPress?: (result: SearchResult) => void;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  showCategories?: boolean;
  autoFocus?: boolean;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onResultPress,
  onSearchSubmit,
  placeholder = 'Search bars, cocktails, events...',
  showCategories = true,
  autoFocus = false,
  style,
}) => {
  const {
    query,
    results,
    loading,
    error,
    suggestions,
    searchHistory,
    setQuery,
    clearSearch,
    selectCategory,
    activeCategory,
    hasResults,
  } = useSearch({ debounceMs: 300, autoSearch: true });

  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const categories: { id: SearchCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: 'search' },
    { id: 'bars', label: 'Bars', icon: 'location' },
    { id: 'cocktails', label: 'Drinks', icon: 'wine' },
    { id: 'events', label: 'Events', icon: 'calendar' },
  ];

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setShowSuggestions(true);
  };

  const handleClearPress = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
    onSearchSubmit?.(suggestion);
  };

  const handleResultPress = (result: SearchResult) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    onResultPress?.(result);
  };

  const handleCategoryPress = (category: SearchCategory) => {
    selectCategory(category);
  };

  const renderSuggestionItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
    >
      <View style={styles.resultImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.resultImage} />
        ) : (
          <View style={styles.resultImagePlaceholder}>
            <Ionicons
              name={
                item.type === 'bar'
                  ? 'location'
                  : item.type === 'cocktail'
                  ? 'wine'
                  : 'calendar'
              }
              size={20}
              color="#fff"
            />
          </View>
        )}
      </View>
      
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.resultSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
        {item.barName && item.type !== 'bar' && (
          <Text style={styles.resultBarName} numberOfLines={1}>
            Available at {item.barName}
          </Text>
        )}
      </View>
      
      <View style={styles.resultMeta}>
        {item.available !== undefined && (
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.available ? '#4CAF50' : '#F44336' },
            ]}
          />
        )}
        {item.rating && (
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={16}
        color={activeCategory === item.id ? '#5BC0CE' : '#666'}
      />
      <Text
        style={[
          styles.categoryText,
          activeCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Search Input */}
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleQueryChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onSubmitEditing={() => onSearchSubmit?.(query)}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="never"
        />
        
        {loading && (
          <ActivityIndicator size="small" color="#5BC0CE" style={styles.loadingIcon} />
        )}
        
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      {showCategories && (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        />
      )}

      {/* Suggestions and Results */}
      {showSuggestions && (query.length > 0 || suggestions.length > 0) && (
        <View style={styles.resultsContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {query.length === 0 && suggestions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <FlatList
                data={suggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={(item) => item}
                scrollEnabled={false}
              />
            </View>
          )}

          {query.length > 0 && hasResults && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Results ({results.length})
              </Text>
              <FlatList
                data={results}
                renderItem={renderResultItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {query.length > 0 && !hasResults && !loading && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try searching for bars, cocktails, or events
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: '#5BC0CE',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  loadingIcon: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  categoriesContainer: {
    marginHorizontal: 16,
  },
  categoriesContent: {
    paddingVertical: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryItemActive: {
    backgroundColor: '#E8F7F7',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#5BC0CE',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    maxHeight: 400,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  resultImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5BC0CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  resultBarName: {
    fontSize: 12,
    color: '#5BC0CE',
  },
  resultMeta: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchBar;
