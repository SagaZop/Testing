import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve access token from AsyncStorage
        const accessToken = await AsyncStorage.getItem('accessToken');

        // Make an API call to get logged-in user's details
        const response = await axios.get(`http://10.0.2.2:5000/api/user/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          setUser(response.data.user); // Set user data
          console.log("User data fetched successfully");
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      await axios.post(
        `http://10.0.2.2:5000/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await AsyncStorage.removeItem('accessToken');

      Alert.alert('Success', 'You have been logged out.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during logout. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          {/* Profile Image */}
          <View style={styles.profileContainer}>
            {user.user_photo ? (
              <Image source={{ uri: user.user_photo }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.initial}>{user.name[0]}</Text>
              </View>
            )}
          </View>

          {/* User Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.infoText}>{user.email}</Text>
            <Text style={styles.infoText}>{user.phone_number}</Text>
            {/* Add any other user details you wish to display here */}
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading user details...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  profileContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FF6347',
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: '#fff',
    fontSize: 50,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
});

export default UserProfileScreen;
