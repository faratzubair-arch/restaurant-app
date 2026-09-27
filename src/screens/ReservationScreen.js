// src/screens/ReservationScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const timeSlots = ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

export default function ReservationScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [reservations, setReservations] = useState([]);

  const handleBooking = () => {
    if (!name || !phone || !selectedDate || !selectedTime) {
      alert('Please fill in all booking details.');
      return;
    }
    const newBooking = { id: Date.now().toString(), name, phone, date: selectedDate, time: selectedTime, partySize };
    setReservations([...reservations, newBooking]);
    alert(`Table successfully booked for ${name}!`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book a Desi Table</Text>

      <View style={styles.formCard}>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone (03XX-XXXXXXX)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={selectedDate} onChangeText={setSelectedDate} />

        <Text style={styles.label}>Party Size: {partySize} persons</Text>
        <View style={styles.row}>
          {[2, 4, 6, 8].map(num => (
            <TouchableOpacity key={num} style={[styles.chip, partySize === num && styles.activeChip]} onPress={() => setPartySize(num)}>
              <Text style={[styles.chipText, partySize === num && styles.activeChipText]}>{num}</Text>
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

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookText}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7', padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
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
  bookButton: { backgroundColor: '#5cb85c', padding: 12, borderRadius: 8, alignItems: 'center' },
  bookText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});