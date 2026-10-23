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

  // Safe price calculation for numbers and strings
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

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Aapka cart khali hai!');
      return;
    }

    try {
      setIsSubmitting(true);

      // Backend model expects 'orderItems' containing menuItem ID and quantity
      const orderItems = items.map(item => ({
        menuItem: item._id || item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        orderItems: orderItems,
        // Note: Total price is calculated securely on the server side to prevent tampering
      };

      const response = await fetch(`${API_URL || 'https://social-frogs-brake.loca.lt'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Aapka order kamyaabi se place ho gaya hai!');
        clearCart();
      } else {
        Alert.alert('Error', data.message || 'Order place karne mein masla aaya.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Server se connection nahi ho saka.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary & Bill</Text>

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
              <TouchableOpacity onPress={() => decrement(item.id || item._id)} style={styles.stepBtn}><Text>-</Text></TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increment(item.id || item._id)} style={styles.stepBtn}><Text>+</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Promo Code Section */}
      <View style={styles.promoBox}>
        <TextInput
          style={styles.input}
          placeholder="Promo Code (e.g. WELCOME10)"
          value={promoInput}
          onChangeText={setPromoInput}
        />
        <TouchableOpacity style={styles.promoBtn} onPress={() => applyPromo(promoInput)}>
          <Text style={styles.btnText}>Apply</Text>
        </TouchableOpacity>
      </View>
      {promoCode !== '' && (
        <View style={styles.appliedPromo}>
          <Text style={styles.promoText}>Applied: {promoCode} ({discountPercent}%)</Text>
          <TouchableOpacity onPress={removePromo}><Text style={styles.removeText}>Remove</Text></TouchableOpacity>
        </View>
      )}

      {/* Bill Breakdown */}
      <View style={styles.billContainer}>
        <View style={styles.billRow}><Text>Subtotal:</Text><Text>Rs. {totals.subtotal}</Text></View>
        <View style={styles.billRow}><Text>Service Charge (5%):</Text><Text>Rs. {totals.serviceCharge}</Text></View>
        <View style={styles.billRow}><Text>Sales Tax (15%):</Text><Text>Rs. {totals.tax}</Text></View>
        {discountPercent > 0 && (
          <View style={styles.billRow}><Text>Discount:</Text><Text>- Rs. {totals.discount}</Text></View>
        )}
        <View style={[styles.billRow, styles.totalRow]}><Text style={styles.totalText}>Grand Total:</Text><Text style={styles.totalText}>Rs. {totals.grandTotal}</Text></View>
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { color: '#666' },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  qty: { marginHorizontal: 10, fontWeight: 'bold' },
  promoBox: { flexDirection: 'row', marginVertical: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff', height: 40 },
  promoBtn: { backgroundColor: '#d9534f', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8, marginLeft: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  appliedPromo: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#eff8ed', padding: 8, borderRadius: 6, marginBottom: 10 },
  promoText: { color: '#2e7d32', fontWeight: 'bold' },
  removeText: { color: '#d9534f', fontWeight: 'bold' },
  billContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalRow: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 8, marginTop: 4 },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#d9534f' },
  checkoutBtn: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
