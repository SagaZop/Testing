// InitialLoadingScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InitialLoadingScreen = ({ navigation }) => {
  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        navigation.replace('Login'); // No refresh token, navigate to login
        return;
      }

      const response = await axios.post('http://10.0.2.2:5000/api/auth/refresh-token', {
        token: refreshToken, // Fixed naming consistency here
      });

      const { accessToken } = response.data;
      // Store the new access token
      await AsyncStorage.setItem('accessToken', accessToken);

      // Navigate to the BrowseRestaurants screen
      navigation.replace('BrowseRestaurants');
    } catch (error) {
      console.error('Error refreshing access token:', error);
      Alert.alert('Error', 'Your session has expired. Please log in again.');
      navigation.replace('Login');
    }
  };

  // Check for refresh token on app start
  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InitialLoadingScreen;
