import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { apiRequest } from '../api/client';

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'orders', 'reservations'
  
  // Menu States
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Orders & Reservations States
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Fetch Menu
  const fetchMenu = async () => {
    try {
      const data = await apiRequest('/menu', 'GET');
      setMenuItems(data || []);
    } catch (error) {
      console.log('Fetch Menu Error:', error.message);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const data = await apiRequest('/orders', 'GET', null, true);
      setOrders(data || []);
    } catch (error) {
      console.log('Fetch Orders Error:', error.message);
    }
  };

  // Fetch Reservations
  const fetchReservations = async () => {
    try {
      const data = await apiRequest('/reservations', 'GET', null, true);
      setReservations(data || []);
    } catch (error) {
      console.log('Fetch Reservations Error:', error.message);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    fetchReservations();
  }, []);

  // Menu Handlers
  const handleAddDish = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Please fill in Name, Price, and Category');
      return;
    }

    try {
      const newItem = {
        name,
        price: Number(price),
        category,
        description: description || 'Delicious dish',
        isAvailable: true,
      };

      await apiRequest('/menu', 'POST', newItem, true);
      Alert.alert('Success', 'Dish added successfully to database!');
      setName('');
      setPrice('');
      setCategory('');
      setDescription('');
      fetchMenu();
    } catch (error) {
      Alert.alert('Error Saving Dish', error.message);
    }
  };

  const handleUpdateDish = async (id, currentStatus) => {
    try {
      await apiRequest(`/menu/${id}`, 'PUT', { isAvailable: !currentStatus }, true);
      fetchMenu();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteDish = async (id) => {
    try {
      await apiRequest(`/menu/${id}`, 'DELETE', null, true);
      Alert.alert('Success', 'Item deleted from database!');
      fetchMenu();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Order Status Update Handler (Pending -> Preparing -> Ready -> Served)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiRequest(`/orders/${orderId}/status`, 'PATCH', { status: newStatus }, true);
      Alert.alert('Success', `Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Reservation Status Update Handler (Confirmed / Declined)
  const handleUpdateReservation = async (resId, newStatus) => {
    try {
      await apiRequest(`/reservations/${resId}`, 'PATCH', { status: newStatus }, true);
      Alert.alert('Success', `Reservation ${newStatus}`);
      fetchReservations();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manager Dashboard</Text>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'menu' && styles.activeTab]} onPress={() => setActiveTab('menu')}>
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'orders' && styles.activeTab]} onPress={() => setActiveTab('orders')}>
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'reservations' && styles.activeTab]} onPress={() => setActiveTab('reservations')}>
          <Text style={[styles.tabText, activeTab === 'reservations' && styles.activeTabText]}>Reservations</Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.form}>
            <TextInput placeholder="Dish Name" placeholderTextColor="#888" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Price" placeholderTextColor="#888" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Category (e.g. Mains)" placeholderTextColor="#888" value={category} onChangeText={setCategory} style={styles.input} />
            <TextInput placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} style={styles.input} />
            
            <TouchableOpacity style={styles.submitButton} onPress={handleAddDish}>
              <Text style={styles.submitButtonText}>ADD DISH TO DATABASE</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeading}>Existing Menu Items:</Text>
          {menuItems.map((item) => {
            const itemId = item._id || item.id;
            return (
              <View key={itemId} style={styles.card}>
                <Text style={styles.title}>{item.name} - Rs {item.price}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Status: {item.isAvailable !== false ? 'Available' : 'Unavailable'}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleUpdateDish(itemId, item.isAvailable !== false)}>
                    <Text style={styles.btnText}>{item.isAvailable !== false ? "Mark Unavailable" : "Mark Available"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDeleteDish(itemId)}>
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>Order ID: {item._id.slice(-6)}</Text>
              <Text>Customer: {item.user?.name || 'Customer'}</Text>
              <Text style={styles.statusText}>Current Status: {item.status}</Text>
              <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Total: Rs. {item.totalPrice}</Text>
              
              <View style={styles.actions}>
                {item.status === 'Pending' && (
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f0ad4e' }]} onPress={() => handleUpdateOrderStatus(item._id, 'Preparing')}>
                    <Text style={styles.btnText}>Mark Preparing</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'Preparing' && (
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0275d8' }]} onPress={() => handleUpdateOrderStatus(item._id, 'Ready')}>
                    <Text style={styles.btnText}>Mark Ready</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'Ready' && (
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5cb85c' }]} onPress={() => handleUpdateOrderStatus(item._id, 'Served')}>
                    <Text style={styles.btnText}>Mark Served</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}

      {/* TAB 3: RESERVATIONS MANAGEMENT */}
      {activeTab === 'reservations' && (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No reservations found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>Table #{item.tableNumber} ({item.guests} Guests)</Text>
              <Text>Customer: {item.user?.name || 'Customer'}</Text>
              <Text>Date & Time: {item.date} at {item.time}</Text>
              <Text style={styles.statusText}>Status: {item.status}</Text>

              {item.status === 'Pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5cb85c' }]} onPress={() => handleUpdateReservation(item._id, 'Confirmed')}>
                    <Text style={styles.btnText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleUpdateReservation(item._id, 'Declined')}>
                    <Text style={styles.btnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  tabContainer: { flexDirection: 'row', marginBottom: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#f9f9f9' },
  activeTab: { backgroundColor: '#d9534f' },
  tabText: { fontWeight: 'bold', color: '#555' },
  activeTabText: { color: '#fff' },
  subHeading: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  form: { marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 5, backgroundColor: '#f9f9f9' },
  submitButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { padding: 15, backgroundColor: '#f2f2f2', marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  title: { fontSize: 16, fontWeight: 'bold' },
  statusText: { fontWeight: '600', color: '#333', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionBtn: { backgroundColor: '#555', padding: 8, borderRadius: 4 },
  deleteBtn: { backgroundColor: '#d9534f' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 }
});