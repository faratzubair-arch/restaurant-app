// src/screens/ReservationScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const timeSlots = ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

export default function ReservationScreen({ setActiveScreen }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);

  const { token, API_URL } = useAuth();

  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch available restaurant tables from backend
  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tables`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTables(data);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  // Submit table reservation form
  const handleBooking = async () => {
    if (!name || !phone || !selectedTable || !selectedDate || !selectedTime) {
      Alert.alert('Incomplete Form', 'Please fill in all fields (Full Name, Phone Number, Table, Date, and Time Slot).');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableNumber: selectedTable.tableNumber,
          guests: Number(guests),
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Reservation Successful',
          `Table successfully booked for ${name}! Check the Status tab to view live updates.`
        );
        setName('');
        setPhone('');
        setSelectedTable(null);
        setSelectedDate('');
        setSelectedTime('');
        
        // Navigate to status screen upon successful booking
        if (setActiveScreen) {
          setActiveScreen('reservationHistory');
        }
      } else {
        Alert.alert('Booking Failed', data.message || 'Unable to complete your reservation.');
      }
    } catch (err) {
      console.error('Booking request error:', err);
      Alert.alert('Connection Error', 'Failed to connect to the server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Book a Table</Text>

      {/* Live Status Check Button */}
      {setActiveScreen && (
        <TouchableOpacity 
          style={styles.historyBtn} 
          onPress={() => setActiveScreen('reservationHistory')}
        >
          <Text style={styles.historyBtnText}>View Live Reservation Status</Text>
        </TouchableOpacity>
      )}

      <View style={styles.formCard}>
        {/* Full Name Field */}
        <Text style={styles.label}>Full Name:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your full name" 
          placeholderTextColor="#555555"
          value={name} 
          onChangeText={setName} 
        />

        {/* Phone Number Field */}
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., 03001234567" 
          placeholderTextColor="#555555"
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad"
        />

        {/* Reservation Date Field */}
        <Text style={styles.label}>Reservation Date:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="YYYY-MM-DD (e.g., 2026-10-30)" 
          placeholderTextColor="#555555"
          value={selectedDate} 
          onChangeText={setSelectedDate} 
        />

        {/* Table Selection Field */}
        <Text style={styles.label}>Select Table:</Text>
        <View style={styles.slotContainer}>
          {tables.length > 0 ? (
            tables.map(tbl => (
              <TouchableOpacity 
                key={tbl._id} 
                style={[styles.slot, selectedTable?._id === tbl._id && styles.activeSlot]} 
                onPress={() => setSelectedTable(tbl)}
              >
                <Text style={[styles.slotText, selectedTable?._id === tbl._id && styles.activeSlotText]}>
                  Table #{tbl.tableNumber} ({tbl.capacity} Seats)
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTableText}>Loading available tables...</Text>
          )}
        </View>

        {/* Guest Count Field */}
        <Text style={styles.label}>Guests: {guests} {guests > 1 ? 'persons' : 'person'}</Text>
        <View style={styles.row}>
          {[2, 4, 6, 8].map(num => (
            <TouchableOpacity 
              key={num} 
              style={[styles.chip, guests === num && styles.activeChip]} 
              onPress={() => setGuests(num)}
            >
              <Text style={[styles.chipText, guests === num && styles.activeChipText]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Slot Field */}
        <Text style={styles.label}>Time Slot:</Text>
        <View style={styles.slotContainer}>
          {timeSlots.map(slot => (
            <TouchableOpacity 
              key={slot} 
              style={[styles.slot, selectedTime === slot && styles.activeSlot]} 
              onPress={() => setSelectedTime(slot)}
            >
              <Text style={[styles.slotText, selectedTime === slot && styles.activeSlotText]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submission Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookText}>Confirm Reservation</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fdfbf7' 
  },
  scrollContent: { 
    padding: 20, 
    paddingTop: 40, 
    paddingBottom: 140 // Extra space taake button bottom navigation bar ke upar pura scroll ho sake
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#111111' },
  historyBtn: { backgroundColor: '#0275d8', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  historyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  formCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#e5e5e5' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#111111', marginBottom: 6, marginTop: 6 },
  input: { 
    height: 48, 
    borderWidth: 1.2, 
    borderColor: '#222222', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    marginBottom: 14, 
    backgroundColor: '#ffffff', 
    fontSize: 15, 
    color: '#000000', 
    fontWeight: '500' 
  },
  row: { flexDirection: 'row', marginBottom: 15 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#eeeeee', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#222222' },
  activeChip: { backgroundColor: '#d9534f', borderColor: '#d9534f' },
  chipText: { fontWeight: 'bold', color: '#111111' },
  activeChipText: { color: '#ffffff' },
  slotContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  slot: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1.2, borderColor: '#222222', borderRadius: 6, marginRight: 8, marginBottom: 8, backgroundColor: '#ffffff' },
  activeSlot: { backgroundColor: '#d9534f', borderColor: '#d9534f' },
  slotText: { color: '#111111', fontWeight: '500' },
  activeSlotText: { color: '#ffffff', fontWeight: 'bold' },
  noTableText: { fontSize: 13, color: '#666666', fontStyle: 'italic', marginBottom: 10 },
  bookButton: { backgroundColor: '#5cb85c', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 14 },
  bookText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});