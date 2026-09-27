// src/screens/MenuScreen.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { mockMenu } from '../data/menu';
import MenuItemCard from '../components/MenuItemCard'; // MenuItemCard import kiya
import { useCart } from '../context/CartContext';

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'lowHigh', 'highLow', 'az'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState([]); // Favourite items ke liye state

  const { addItem } = useCart();
  const searchInputRef = useRef(null);

  const fetchMenu = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setMenuItems(mockMenu);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // useCallback se handlers ko stable rakha taake un-necessary re-renders na hon
  const handleAddToCart = useCallback((item) => {
    addItem(item);
    alert(`Added ${item.name} to cart!`);
  }, [addItem]);

  const handleToggleFavorite = useCallback((id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }, []);

  // useMemo se filtering aur sorting ko optimize kiya (derived state ko state mein nahi rakha)
  const filteredAndSortedItems = useMemo(() => {
    let result = [...menuItems];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchText.trim() !== '') {
      const query = searchText.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }

    // Sorting logic
    if (sortBy === 'lowHigh') {
      result.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'highLow') {
      result.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [menuItems, selectedCategory, searchText, sortBy]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#d9534f" />
        <Text style={styles.loadingText}>Loading Desi Menu...</Text>
      </View>
    );
  }

  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Pakistani Restaurant Menu</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Category Chips */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.activeChip]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.activeChipText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Buttons */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort By:</Text>
        <TouchableOpacity style={[styles.sortBtn, sortBy === 'lowHigh' && styles.activeSort]} onPress={() => setSortBy('lowHigh')}>
          <Text style={styles.sortText}>Price: Low-High</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sortBtn, sortBy === 'highLow' && styles.activeSort]} onPress={() => setSortBy('highLow')}>
          <Text style={styles.sortText}>Price: High-Low</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sortBtn, sortBy === 'az' && styles.activeSort]} onPress={() => setSortBy('az')}>
          <Text style={styles.sortText}>Name: A-Z</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List using MenuItemCard */}
      <FlatList
        data={filteredAndSortedItems}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMenu} />}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7', padding: 15, paddingTop: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  searchInput: { flex: 1, height: 40 },
  categoryContainer: { flexDirection: 'row', marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f0e6d2', borderRadius: 20, marginRight: 8 },
  activeChip: { backgroundColor: '#d9534f' },
  chipText: { color: '#555', fontWeight: '600', fontSize: 12 },
  activeChipText: { color: '#fff' },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap' },
  sortLabel: { fontSize: 12, fontWeight: 'bold', marginRight: 5 },
  sortBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#eee', borderRadius: 4, marginRight: 5, marginBottom: 5 },
  activeSort: { backgroundColor: '#333' },
  sortText: { fontSize: 11, color: '#fff' },
});