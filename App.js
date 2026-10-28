// App.js
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';

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
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import ReservationHistoryScreen from './src/screens/ReservationHistoryScreen';

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
        {activeScreen === 'reservation' && <ReservationScreen setActiveScreen={setActiveScreen} />} 
        {activeScreen === 'reservationHistory' && <ReservationHistoryScreen />}
        {activeScreen === 'profile' && <ProfileScreen setActiveScreen={setActiveScreen} />}  
        {activeScreen === 'orderHistory' && <OrderHistoryScreen />}  
      </View>

      {/* Bottom Navigation Bar for Customer */}
      <View style={[styles.navBar, { backgroundColor: '#ffffff', borderTopColor: '#e0e0e0' }]}>
        <TouchableOpacity 
          style={[styles.navItem, activeScreen === 'menu' && styles.activeNavItem]} 
          onPress={() => setActiveScreen('menu')}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeScreen === 'menu' && styles.activeNavText]}>🍽️ Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeScreen === 'cart' && styles.activeNavItem]} 
          onPress={() => setActiveScreen('cart')}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeScreen === 'cart' && styles.activeNavText]}>
            🛒 Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeScreen === 'reservation' && styles.activeNavItem]} 
          onPress={() => setActiveScreen('reservation')}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeScreen === 'reservation' && styles.activeNavText]}>📅 Table</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeScreen === 'reservationHistory' && styles.activeNavItem]} 
          onPress={() => setActiveScreen('reservationHistory')}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeScreen === 'reservationHistory' && styles.activeNavText]}>📊 Status</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeScreen === 'profile' && styles.activeNavItem]} 
          onPress={() => setActiveScreen('profile')}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeScreen === 'profile' && styles.activeNavText]}>👤 Profile</Text>
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
    height: Platform.OS === 'ios' ? 82 : 72,
    borderTopWidth: 1.2,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeNavItem: {
    backgroundColor: '#f3f4f6',
  },
  navText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555555',
  },
  activeNavText: {
    color: '#d9534f',
    fontWeight: 'bold',
  },
});