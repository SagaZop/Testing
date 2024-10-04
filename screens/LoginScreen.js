import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlert } from '../App'; // Import useAlert hook

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Access the showAlert function
  const { showAlert } = useAlert();


  const handleLogin = async () => {
    if (!email || !password) {

      return showAlert('danger', 'Please fill in both email and password'); // Show custom alert;
    }

    const userData = { email, password };
    setLoading(true);

    try {
      // Make an API call to your login endpoint
      const response = await axios.post(`http://10.0.2.2:5000/api/auth/login`, userData);

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;

        // Store access and refresh tokens in AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        // Navigate to Home screen
        showAlert('success', 'Login Successfull'); // Show custom alert;
        navigation.navigate('MainHome');
      }
    } catch (error) {
      // Handle authentication errors or server errors
      if (error.response && error.response.data && error.response.data.message) {
        showAlert('danger', error.response.data.message); // Show custom alert

      } else {
        showAlert('danger', 'An unexpected error occurred. Please try again.'); // Show custom alert
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () =>{
    console.log("Clicked reset password");
    navigation.navigate('ResetPassword')
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Zoppli</Text>
      <Text style={styles.subtitle}>100% Green Deliveries in India</Text>

      {/* Email and Password Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Links for Forgot Password and Registration */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResetPassword}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4385A',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#FF9900',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  link: {
    color: '#00000',
    textAlign: 'center',
  },
});

export default LoginScreen;
