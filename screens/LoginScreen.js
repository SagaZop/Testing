import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please fill in both email and password');
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
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('MainHome');
      }
    } catch (error) {
      // Handle authentication errors or server errors
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Login Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Zoppli</Text>
      <Text style={styles.subtitle}>100% Green Deliveries in India</Text>

      {/* email and Password Inputs */}
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
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

      {/* OR Divider */}
      <Text style={styles.orText}>OR</Text>
      <View style={styles.socialButtons}>
        <Button title="Facebook" onPress={() => {}} />
        <Button title="Google" onPress={() => {}} />
      </View>

      {/* Terms and Policies */}
      <Text style={styles.footer}>
        By continuing, you agree to our {'\n'}
        <Text style={styles.link}>Terms of Service</Text>,{' '}
        <Text style={styles.link}>Privacy Policy</Text>,{' '}
        <Text style={styles.link}>Content Policy</Text>
      </Text>
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
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#FFFFFF',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 20,
  },
  link: {
    color: '#00C853',
  },
});

export default LoginScreen;
