// utils/authHelper.js
import { jwtDecode } from 'jwt-decode';
// const jwtDecode = require('jwt-decode');  // Use require instead of import
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to decode the token and check if it's expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = jwtDecode(token);  // Ensure jwtDecode works correctly
  const currentTime = Date.now() / 1000; // current time in seconds
  return decoded.exp < currentTime;
};

// Function to get access token, and refresh it if necessary
export const getAccessToken = async () => {
  let accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  if (!accessToken || isTokenExpired(accessToken)) {
    // If the access token is expired, refresh it
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/refresh-token', {
        token: refreshToken,
      });

      if (response.status === 200) {
        accessToken = response.data.accessToken;

        // Store the new access token in AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null; // Token refresh failed, user will need to log in again
    }
  }

  return accessToken;
};
