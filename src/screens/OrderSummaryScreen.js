// src/screens/OrderSummaryScreen.js
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SERVICE_CHARGE_RATE = 0.05; // 5%
const SALES_TAX_RATE = 0.15; // 15%

export default function OrderSummaryScreen() {
  const { items, discountPercent, promoCode, applyPromo, removePromo, increment, decrement, clearCart } = useCart();
  const { token, API_URL } = useAuth();
  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate cart subtotal, taxes, service charges, and discounts safely
  const totals = useMemo(() => {
    let subtotal = 0;
    items.forEach(item => {
      let numericPrice = 0;
      if (typeof item.price === 'number') {
        numericPrice = item.price;
      } else if (typeof item.price === 'string') {
        numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      }
      subtotal += numericPrice * item.quantity;
    });

    const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
    const tax = subtotal * SALES_TAX_RATE;
    const discount = (subtotal * discountPercent) / 100;
    const grandTotal = subtotal + serviceCharge + tax - discount;

    return {
      subtotal: subtotal.toFixed(2),
      serviceCharge: serviceCharge.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  }, [items, discountPercent]);

  // Handle final checkout order submission
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Please add items before placing an order.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = items.map(item => ({
        menuItem: item._id || item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        orderItems: orderItems,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Order Placed', 'Your order has been placed successfully!');
        clearCart();
      } else {
        Alert.alert('Order Failed', data.message || 'Unable to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      Alert.alert('Connection Error', 'Failed to connect to the server. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary & Bill</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is currently empty. Add items from the menu.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id || item._id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>Rs. {item.price} x {item.quantity}</Text>
              </View>
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => decrement(item.id || item._id)} style={styles.stepBtn}>
                  <Text style={styles.stepText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increment(item.id || item._id)} style={styles.stepBtn}>
                  <Text style={styles.stepText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Available Promo Hints */}
      <View style={styles.promoHintBox}>
        <Text style={styles.promoHintTitle}>Available Offer:</Text>
        <TouchableOpacity onPress={() => setPromoInput('WELCOME10')}>
          <Text style={styles.promoCodeBadge}>Tap here to use WELCOME10 (10% OFF)</Text>
        </TouchableOpacity>
      </View>

      {/* Promo Code Input Section */}
      <View style={styles.promoBox}>
        <TextInput
          style={styles.input}
          placeholder="Promo Code (e.g. WELCOME10)"
          placeholderTextColor="#777"
          value={promoInput}
          onChangeText={setPromoInput}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.promoBtn} onPress={() => applyPromo(promoInput)}>
          <Text style={styles.btnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {promoCode !== '' && (
        <View style={styles.appliedPromo}>
          <Text style={styles.promoText}>Applied: {promoCode} ({discountPercent}%)</Text>
          <TouchableOpacity onPress={removePromo}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bill Breakdown */}
      <View style={styles.billContainer}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Subtotal:</Text>
          <Text style={styles.billValue}>Rs. {totals.subtotal}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Service Charge (5%):</Text>
          <Text style={styles.billValue}>Rs. {totals.serviceCharge}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Sales Tax (15%):</Text>
          <Text style={styles.billValue}>Rs. {totals.tax}</Text>
        </View>
        {discountPercent > 0 && (
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount ({discountPercent}%):</Text>
            <Text style={[styles.billValue, styles.discountText]}>- Rs. {totals.discount}</Text>
          </View>
        )}
        <View style={[styles.billRow, styles.totalRow]}>
          <Text style={styles.totalText}>Grand Total:</Text>
          <Text style={styles.totalText}>Rs. {totals.grandTotal}</Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity 
        style={[styles.checkoutBtn, isSubmitting && { opacity: 0.7 }]} 
        onPress={handlePlaceOrder}
        disabled={isSubmitting}
      >
        <Text style={styles.checkoutText}>{isSubmitting ? 'Placing Order...' : 'Place Order'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdfbf7', paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#222' },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 14, fontStyle: 'italic', textAlign: 'center' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#222' },
  itemPrice: { color: '#666', marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: { backgroundColor: '#e9ecef', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  stepText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  qty: { marginHorizontal: 12, fontWeight: 'bold', fontSize: 15, color: '#111' },
  promoHintBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  promoHintTitle: { fontSize: 12, color: '#666', marginRight: 6 },
  promoCodeBadge: { fontSize: 12, color: '#0275d8', fontWeight: 'bold', textDecorationLine: 'underline' },
  promoBox: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#bbb', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', height: 44, color: '#111', fontSize: 14 },
  promoBtn: { backgroundColor: '#d9534f', justifyContent: 'center', paddingHorizontal: 18, borderRadius: 8, marginLeft: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  appliedPromo: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#eff8ed', padding: 10, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#c3e6cb' },
  promoText: { color: '#2e7d32', fontWeight: 'bold' },
  removeText: { color: '#d9534f', fontWeight: 'bold' },
  billContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 10, elevation: 1 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { color: '#444', fontSize: 14 },
  billValue: { color: '#222', fontSize: 14, fontWeight: '500' },
  discountText: { color: '#2e7d32', fontWeight: 'bold' },
  totalRow: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 8, marginTop: 4 },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#d9534f' },
  checkoutBtn: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});