// App.js
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

// Context Providers
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { CartProvider, useCart } from './src/context/CartContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import OrderSummaryScreen from './src/screens/OrderSummaryScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ManagerDashboard from './src/screens/ManagerDashboard';

function MainNavigator() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { items } = useCart();
  const [activeScreen, setActiveScreen] = useState('menu');

  // 1. Agar user login nahi hai, toh Login Screen dikhao
  if (!user) {
    return <LoginScreen />;
  }

  // 2. Agar user Manager hai, toh Manager Dashboard dikhao
  if (user.role === 'manager') {
    return <ManagerDashboard />;
  }

  // 3. Agar user Customer hai, toh Customer ki screens aur bottom navigation bar dikhao
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Active Screen Renderer */}
      <View style={styles.screenContainer}>
        {activeScreen === 'menu' && <MenuScreen />}
        {activeScreen === 'cart' && <OrderSummaryScreen />}
        {activeScreen === 'reservation' && <ReservationScreen />}
        {activeScreen === 'profile' && <ProfileScreen />}
      </View>

      {/* Bottom Navigation Bar for Customer */}
      <View style={[styles.navBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveScreen('menu')}>
          <Text style={styles.navText}>🍽️ Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveScreen('cart')}>
          <Text style={styles.navText}>🛒 Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveScreen('reservation')}>
          <Text style={styles.navText}>📅 Table</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveScreen('profile')}>
          <Text style={styles.navText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <MainNavigator />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d9534f',
  },
});