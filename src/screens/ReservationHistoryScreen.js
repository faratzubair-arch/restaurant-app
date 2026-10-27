// src/screens/ReservationHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ReservationHistoryScreen() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { token, API_URL } = useAuth();

  // Fetch current user's reservations from backend
  const fetchReservations = async (isBackground = false) => {
    try {
      if (!isBackground) setError(null);
      
      const response = await fetch(`${API_URL}/api/reservations/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReservations(data);
      } else {
        if (!isBackground) {
          setError(data.message || 'Failed to load reservations.');
        }
      }
    } catch (err) {
      console.error('Fetch reservations error:', err);
      if (!isBackground) {
        setError('Unable to connect to the server. Please check your network.');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations(false);

    // Poll every 10 seconds to update live reservation status without UI flicker
    const interval = setInterval(() => {
      fetchReservations(true);
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#d9534f" />
        <Text style={styles.loadingText}>Loading your reservations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Table Reservation Status</Text>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : reservations.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>You have not reserved any tables yet.</Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchReservations(false);
              }}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.tableText}>Table #{item.tableNumber}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Confirmed'
                      ? styles.successBadge
                      : item.status === 'Declined'
                      ? styles.dangerBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'Confirmed'
                        ? styles.successText
                        : item.status === 'Declined'
                        ? styles.dangerText
                        : styles.pendingText,
                    ]}
                  >
                    {item.status || 'Pending'}
                  </Text>
                </View>
              </View>
              <Text style={styles.details}>Date: {item.date} | Time: {item.time}</Text>
              <Text style={styles.details}>Guests: {item.guests} {item.guests > 1 ? 'Persons' : 'Person'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7', padding: 16, paddingTop: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tableText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  pendingBadge: { backgroundColor: '#fff3cd' },
  pendingText: { color: '#856404' },
  successBadge: { backgroundColor: '#d4edda' },
  successText: { color: '#155724' },
  dangerBadge: { backgroundColor: '#f8d7da' },
  dangerText: { color: '#721c24' },
  details: { fontSize: 14, color: '#555', marginBottom: 4 },
  errorText: { color: '#d9534f', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center' },
});