import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token); // Make sure `jwtDecode` is imported correctly
    return decoded.exp * 1000 < Date.now(); // Checks if token is expired
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // If there's an error decoding, assume the token is expired
  }
};

// Refresh the access token using the refresh token
const refreshAccessToken = async () => {
  console.log("Ibnside refreshAccessTokenes")
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not found');

    // Make an API call to refresh the access token
    const response = await axios.post(`http://10.0.2.2:5000/api/auth/refresh-token`, { token: refreshToken });

    if (response.status === 200) {
      const { accessToken } = response.data;

      // Store new access token in AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);

      return accessToken;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Check access token on app startup
export const initializeApp = async () => {
  console.log("Inside initializeApp")
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    
    // If no access token found, redirect to Login
    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Check if access token is expired
    if (isTokenExpired(accessToken)) {
      // Refresh the access token
      return await refreshAccessToken();
    }

    // If access token is valid, return it
    return accessToken;
  } catch (error) {
    // Redirect to login screen if any error occurs
    throw error;
  }
};
