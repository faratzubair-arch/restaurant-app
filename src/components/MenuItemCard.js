// src/components/MenuItemCard.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const MenuItemCard = React.memo(({ item, onAddToCart, onToggleFavorite, isFavorite }) => {
  return (
    <View style={[styles.card, !item.isAvailable && styles.disabledCard]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
            <Text style={{ fontSize: 18 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        <TouchableOpacity
          style={[styles.addButton, !item.isAvailable && styles.disabledButton]}
          disabled={!item.isAvailable}
          onPress={() => onAddToCart(item)}
        >
          <Text style={styles.addText}>{item.isAvailable ? 'Add to Cart' : 'Unavailable'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default MenuItemCard;

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  disabledCard: { opacity: 0.6 },
  image: { width: 100, height: 100 },
  infoContainer: { flex: 1, padding: 10, justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#d9534f' },
  description: { fontSize: 12, color: '#666', marginVertical: 4 },
  addButton: { backgroundColor: '#5cb85c', paddingVertical: 6, borderRadius: 5, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  addText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});