import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import axios from 'axios';
import { useAlert } from '../App'; // Import useAlert hook

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Access the showAlert function
  C

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber || !password) {
      return showAlert('danger', 'Please fill in all fields');
    }

    const userData = { name, email, phone_number: phoneNumber, user_type: 'customer', password };

    setLoading(true);

    try {
      const response = await axios.post(`http://10.0.2.2:5000/api/auth/register`, userData);
      if (response.status === 201) {
        showAlert('success', 'Registration successful! Please check your email for verification link.');
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
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Register Button */}
      <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>

      {/* Social Login Buttons */}
      <Text style={styles.orText}>OR</Text>
      <View style={styles.socialButtons}>
        <Button title="Sign up with Facebook" onPress={() => Alert.alert('Info', 'Facebook sign up')} color="#3b5998" />
        <Button title="Sign up with Google" onPress={() => Alert.alert('Info', 'Google sign up')} color="#DB4437" />
      </View>

      {/* Link to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F4385A', // Matching background color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF', // White color for title
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#FF9900', // Orange button color
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FFFFFF', // White color for OR text
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  linkText: {
    color: '#00000', // Green color for links
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;
