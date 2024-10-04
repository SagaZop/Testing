import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAlert } from '../App'; // Import useAlert hook

const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Access the showAlert function
  const { showAlert } = useAlert();

  const handleRequestOtp = async () => {
    if (!email) return showAlert('danger', 'Please enter your email');

    setLoading(true);
    try {
      const response = await axios.post(`http://10.0.2.2:5000/api/auth/reset-password-request`, { email });
      if (response.status === 200) {
        showAlert('success', 'OTP has been sent to your email');
        setOtpSent(true);
      }
    } catch (error) {
      showAlert('danger', error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      return showAlert('danger', 'Please fill in all fields');
    }
    if (newPassword !== confirmPassword) {
      return showAlert('danger', 'Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await axios.post(`http://10.0.2.2:5000/api/auth/reset-password`, { otp, newPassword });
      if (response.status === 200) {
        showAlert('success', 'Password reset successful');
        navigation.navigate('Login');
      }
    } catch (error) {
      showAlert('danger', error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {!otpSent ? (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleRequestOtp} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? <ActivityIndicator color="#fff" /> : 'Get OTP'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity onPress={handleResetPassword} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? <ActivityIndicator color="#fff" /> : 'Change Password'}</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F4385A', // Background color matches the theme
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF', // White color for title
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#FF9900', // Button color matches theme
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default PasswordResetScreen;
