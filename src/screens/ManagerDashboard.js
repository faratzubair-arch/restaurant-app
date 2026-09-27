// src/screens/ManagerDashboard.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ManagerDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Mock Orders & Reservations for Manager
  const [orders, setOrders] = useState([
    { id: '101', customer: 'Ali Khan', items: 'Chicken Biryani x 2', status: 'Pending' },
    { id: '102', customer: 'Farat Zubair', items: 'Mutton Karahi x 1', status: 'Preparing' },
  ]);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍🍳 Manager Dashboard</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'orders' && styles.activeTab]} onPress={() => setActiveTab('orders')}>
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'reservations' && styles.activeTab]} onPress={() => setActiveTab('reservations')}>
          <Text style={styles.tabText}>Reservations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'menu' && styles.activeTab]} onPress={() => setActiveTab('menu')}>
          <Text style={styles.tabText}>Menu Mgmt</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'orders' && (
          <View>
            <Text style={styles.sectionTitle}>Incoming Orders</Text>
            {orders.map(order => (
              <View key={order.id} style={styles.card}>
                <Text style={styles.cardTitle}>Order #{order.id} - {order.customer}</Text>
                <Text>Items: {order.items}</Text>
                <Text style={styles.status}>Status: {order.status}</Text>
                
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => updateOrderStatus(order.id, 'Preparing')}>
                    <Text style={styles.btnText}>Prepare</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => updateOrderStatus(order.id, 'Ready')}>
                    <Text style={styles.btnText}>Ready</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5cb85c' }]} onPress={() => updateOrderStatus(order.id, 'Served')}>
                    <Text style={styles.btnText}>Serve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'reservations' && (
          <View>
            <Text style={styles.sectionTitle}>Table Reservations</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Farat Zubair (4 Persons)</Text>
              <Text>Table: T2 | Date: 2026-10-02 at 14:00</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5cb85c' }]} onPress={() => alert('Reservation Accepted!')}>
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#d9534f' }]} onPress={() => alert('Reservation Declined!')}>
                  <Text style={styles.btnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'menu' && (
          <View>
            <Text style={styles.sectionTitle}>Menu Management</Text>
            <TouchableOpacity style={styles.addMenuBtn} onPress={() => alert('Feature to add new menu item!')}>
              <Text style={styles.addMenuText}>+ Add New Menu Item</Text>
            </TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Chicken Biryani (Rs. 450)</Text>
              <Text style={{ color: 'green', fontWeight: 'bold' }}>Status: Available</Text>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f0ad4e', marginTop: 10 }]} onPress={() => alert('Toggled Availability!')}>
                <Text style={styles.btnText}>Toggle Availability</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7', padding: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#d9534f', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  tabContainer: { flexDirection: 'row', marginBottom: 15 },
  tab: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', borderRadius: 5, marginHorizontal: 3 },
  activeTab: { backgroundColor: '#333' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  content: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#444' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  status: { fontWeight: 'bold', color: '#d9534f', marginVertical: 5 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionBtn: { backgroundColor: '#0275d8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  addMenuBtn: { backgroundColor: '#5cb85c', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  addMenuText: { color: '#fff', fontWeight: 'bold' },
});