import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import defaultImage from '../assets/logo.png'
import { useAlert } from '../App';

const UserProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isVegMode, setIsVegMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`http://10.0.2.2:5000/api/user/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log('Unable to fetch user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.post(`http://10.0.2.2:5000/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await AsyncStorage.removeItem('accessToken');
      showAlert('success', 'User Logged Out Successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.log('An unexpected error occurred during logout. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Profile Image or Fallback with First Letter */}
          <View style={styles.profileContainer}>
            {user?.user_photo ? (
              <Image source={{ uri: user.user_photo }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.initial}>{user?.name[0].toUpperCase()}</Text>
              </View>
            )}
          </View>
        <View style={styles.profileDetails}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity>
            <Text style={styles.viewActivity}>View activity ></Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cards for Profile Completion and Collections */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Icon name="bookmark-border" size={24} color="#FF6347" />
          <Text style={styles.cardText}>Collections</Text>
        </View>
        <View style={styles.card}>
          <Icon name="account-balance-wallet" size={24} color="#FF6347" />
          <Text style={styles.cardText}>Money ₹0</Text>
        </View>
      </View>

      {/* Profile Settings Section */}
      <View style={styles.settingsContainer}>
        {/* Profile completion */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <Icon name="person-outline" size={24} color="#FF6347" />
            <Text style={styles.settingText}>Your Profile</Text>
          </View>
          <Text style={styles.profileCompletion}>48% completed</Text>
        </TouchableOpacity>

        {/* Veg Mode Switch */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <Icon name="restaurant-menu" size={24} color="#FF6347" />
            <Text style={styles.settingText}>Veg Mode</Text>
          </View>
          <Switch value={isVegMode} onValueChange={setIsVegMode} />
        </View>

        {/* Dark Mode Switch */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <Icon name="brightness-2" size={24} color="#FF6347" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        {/* Your rating */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <Icon name="star-border" size={24} color="#FF6347" />
            <Text style={styles.settingText}>Your Rating</Text>
          </View>
          <Text style={styles.ratingText}>--</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FF6347',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#888',
  },
  viewActivity: {
    color: '#FF6347',
    marginTop: 5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  cardText: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  settingsContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  profileCompletion: {
    color: '#FFA000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingText: {
    fontSize: 16,
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
   profileContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
