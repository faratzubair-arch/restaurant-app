// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!isLoginMode) {
      if (!fullName.trim()) {
        Alert.alert('Error', 'Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        const result = await login(email.trim(), password);
        if (result && !result.success) {
          Alert.alert('Login Failed', result.message || 'Invalid credentials');
        }
      } else {
        const result = await signup(fullName.trim(), email.trim(), password, role);
        if (result && result.success) {
          Alert.alert('Success', result.message || 'Account created successfully!');
          setIsLoginMode(true);
          setPassword('');
          setConfirmPassword('');
        } else {
          Alert.alert('Error', result?.message || 'Signup failed');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>
            {isLoginMode ? 'Welcome Back!' : 'Create Account'}
          </Text>

          {/* Full Name (Sign Up only) */}
          {!isLoginMode && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#555555"
                value={fullName}
                onChangeText={setFullName}
              />
            </>
          )}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#555555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password with Eye Toggle */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#555555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeBtn} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈 Hide' : '👁 Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password & Role (Sign Up only) */}
          {!isLoginMode && (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#555555"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeBtn} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.eyeText}>{showConfirmPassword ? '🙈 Hide' : '👁 Show'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Account Role</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity 
                  style={[styles.roleButton, role === 'customer' && styles.activeRole]}
                  onPress={() => setRole('customer')}
                >
                  <Text style={[styles.roleText, role === 'customer' && styles.activeRoleText]}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.roleButton, role === 'manager' && styles.activeRole]}
                  onPress={() => setRole('manager')}
                >
                  <Text style={[styles.roleText, role === 'manager' && styles.activeRoleText]}>Manager</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.button, isSubmitting && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLoginMode ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch Mode Button */}
          <TouchableOpacity 
            style={styles.switchContainer}
            onPress={() => {
              setIsLoginMode(!isLoginMode);
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <Text style={styles.switchText}>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.linkText}>{isLoginMode ? 'Sign Up' : 'Login'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#fdfbf7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111111',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    height: 48,
    borderColor: '#222222',
    borderWidth: 1.2,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#222222',
    borderWidth: 1.2,
    borderRadius: 8,
    marginBottom: 14,
    backgroundColor: '#ffffff',
    height: 48,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  eyeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 4,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: '#222222',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#ffffff',
  },
  activeRole: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleText: {
    color: '#111111',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeRoleText: {
    color: '#ffffff',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#333333',
    fontSize: 14,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});