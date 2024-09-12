// screens/BrowseRestaurants.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import RestaurantItem from '../components/RestaurantItem';
import { getAccessToken } from '../utils/authHelper'; // Import the helper function

const BrowseRestaurants = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch restaurant data from backend API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = await getAccessToken(); // Get valid access token

        if (!token) {
          throw new Error('No access token available');
        }

        const response = await axios.get('http://10.0.2.2:5000/api/restaurant', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the access token
          },
        });
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        Alert.alert('Error', 'Unable to fetch restaurants. Please try again.');
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search query
  useEffect(() => {
    const filter = restaurants.filter((restaurant) => {
      const matchesQuery = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesQuery;
    });

    setFilteredRestaurants(filter);
  }, [searchQuery, restaurants]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Restaurants</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RestaurantItem restaurant={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BrowseRestaurants;
