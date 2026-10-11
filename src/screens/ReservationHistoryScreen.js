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

  const fetchReservations = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL || 'http://localhost:5000'}/api/reservations/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReservations(data);
      } else {
        setError(data.message || 'Reservations load karne mein masla aaya.');
      }
    } catch (err) {
      console.error(err);
      setError('Server se connection nahi ho saka.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    // Polling every 10 seconds for live table reservation status update (Confirmed/Declined)
    const interval = setInterval(() => {
      fetchReservations();
    }, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#d9534f" />
        <Text style={styles.loadingText}>Loading Your Reservations...</Text>
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
          <Text style={styles.emptyText}>Aapne abhi tak koi table book nahi ki.</Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReservations(); }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.tableText}>Table #{item.tableNumber}</Text>
                <Text style={[
                  styles.status, 
                  item.status === 'Confirmed' ? styles.success : 
                  item.status === 'Declined' ? styles.danger : styles.pending
                ]}>
                  {item.status || 'Pending'}
                </Text>
              </View>
              <Text style={styles.details}>Date: {item.date} | Time: {item.time}</Text>
              <Text style={styles.details}>Guests: {item.guests} Persons</Text>
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
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tableText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  success: { backgroundColor: '#d4edda', color: '#155724' },
  danger: { backgroundColor: '#f8d7da', color: '#721c24' },
  details: { fontSize: 14, color: '#555', marginBottom: 4 },
  errorText: { color: '#d9534f', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center' },
});