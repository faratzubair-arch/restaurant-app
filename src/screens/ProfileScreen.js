// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>User Profile</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.subtext }]}>Name:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user?.name}</Text>

        <Text style={[styles.label, { color: colors.subtext }]}>Email:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user?.email}</Text>

        <Text style={[styles.label, { color: colors.subtext }]}>Role:</Text>
        <Text style={[styles.value, { color: colors.primary, textTransform: 'uppercase' }]}>
          {user?.role}
        </Text>
      </View>

      {/* Theme Switch */}
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { padding: 20, borderRadius: 10, borderWidth: 1, marginBottom: 20, elevation: 2 },
  label: { fontSize: 14, marginBottom: 2 },
  value: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 20 },
  logoutButton: { backgroundColor: '#d9534f', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});