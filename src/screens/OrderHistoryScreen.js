// src/screens/OrderHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { token, API_URL } = useAuth();

  // Fetch current user order history from backend
  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/orders/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Failed to load order history.');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Unable to connect to the server. Please check your network.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Poll every 10 seconds for real-time order status updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#d9534f" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Order History & Live Status</Text>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>You have not placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders();
              }}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order ID: {item._id.slice(-6)}</Text>
                <Text
                  style={[
                    styles.status,
                    item.status === 'Pending' ? styles.pending : styles.success,
                  ]}
                >
                  {item.status || 'Pending'}
                </Text>
              </View>

              <View style={styles.itemsList}>
                {item.orderItems &&
                  item.orderItems.map((ordItem, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemName}>
                        {ordItem.menuItem?.name || 'Food Item'} x {ordItem.quantity}
                      </Text>
                      <Text style={styles.itemPrice}>
                        Rs. {ordItem.price * ordItem.quantity}
                      </Text>
                    </View>
                  ))}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.dateText}>
                  {new Date(item.createdAt).toLocaleDateString()}{' '}
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.totalText}>Total: Rs. {item.totalPrice}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7', padding: 15, paddingTop: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  orderCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 8, marginBottom: 8 },
  orderId: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  success: { backgroundColor: '#d4edda', color: '#155724' },
  itemsList: { marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { fontSize: 14, color: '#333' },
  itemPrice: { fontSize: 14, color: '#555' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#f0f0f0', paddingTop: 8 },
  dateText: { fontSize: 11, color: '#888' },
  totalText: { fontSize: 15, fontWeight: 'bold', color: '#d9534f' },
  errorText: { color: '#d9534f', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center' },
});