// src/screens/ReservationScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL || 'https://social-frogs-brake.loca.lt'}/api/tables`, {
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

  const handleBooking = async () => {
    if (!name || !phone || !selectedTable || !selectedDate || !selectedTime) {
      alert('Please fill in all fields (Name, Phone, Table, Date, Time).');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL || 'https://social-frogs-brake.loca.lt'}/api/reservations`, {
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
        alert(`Table successfully booked for ${name}! Live status check karne ke liye Status tab par jayein.`);
        setName('');
        setPhone('');
        setSelectedTable(null);
        setSelectedDate('');
        setSelectedTime('');
        
        // Booking ke baad foran status screen par bhej dein
        if (setActiveScreen) {
          setActiveScreen('reservationHistory');
        }
      } else {
        alert(data.message || 'Booking failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book a Desi Table</Text>

      {/* Live Status Check Button */}
      {setActiveScreen && (
        <TouchableOpacity 
          style={styles.historyBtn} 
          onPress={() => setActiveScreen('reservationHistory')}
        >
          <Text style={styles.historyBtnText}>📊 View My Reservation Status (Live)</Text>
        </TouchableOpacity>
      )}

      <View style={styles.formCard}>
        <TextInput 
          style={styles.input} 
          placeholder="Full Name" 
          value={name} 
          onChangeText={setName} 
        />

        <TextInput 
          style={styles.input} 
          placeholder="Phone Number (03XX-XXXXXXX)" 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad"
        />

        <TextInput 
          style={styles.input} 
          placeholder="Date (YYYY-MM-DD)" 
          value={selectedDate} 
          onChangeText={setSelectedDate} 
        />

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
            <Text style={styles.noTableText}>Loading tables...</Text>
          )}
        </View>

        <Text style={styles.label}>Guests: {guests} persons</Text>
        <View style={styles.row}>
          {[2, 4, 6, 8].map(num => (
            <TouchableOpacity key={num} style={[styles.chip, guests === num && styles.activeChip]} onPress={() => setGuests(num)}>
              <Text style={[styles.chipText, guests === num && styles.activeChipText]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Time Slot:</Text>
        <View style={styles.slotContainer}>
          {timeSlots.map(slot => (
            <TouchableOpacity key={slot} style={[styles.slot, selectedTime === slot && styles.activeSlot]} onPress={() => setSelectedTime(slot)}>
              <Text style={[styles.slotText, selectedTime === slot && styles.activeSlotText]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookText}>Confirm Reservation</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7', padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  historyBtn: { backgroundColor: '#0275d8', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  historyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  formCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  input: { height: 45, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginBottom: 12, backgroundColor: '#fafafa' },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 15 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#eee', borderRadius: 20, marginRight: 8 },
  activeChip: { backgroundColor: '#d9534f' },
  chipText: { fontWeight: 'bold', color: '#555' },
  activeChipText: { color: '#fff' },
  slotContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  slot: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginRight: 8, marginBottom: 8 },
  activeSlot: { backgroundColor: '#d9534f', borderColor: '#d9534f' },
  slotText: { color: '#333' },
  activeSlotText: { color: '#fff', fontWeight: 'bold' },
  noTableText: { fontSize: 13, color: '#888', fontStyle: 'italic', marginBottom: 10 },
  bookButton: { backgroundColor: '#5cb85c', padding: 12, borderRadius: 8, alignItems: 'center' },
  bookText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
