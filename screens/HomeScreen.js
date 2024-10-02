import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarked, setBookmarked] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress, setUserAddress] = useState('123 Main St, City, Country'); // Placeholder, replace with real address

  const defaultDishImage = 'http://10.0.2.2:5000/images/default-dish.png';

  // Fetch paginated restaurants
  const fetchRestaurants = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://10.0.2.2:5000/api/restaurant?page=${page}&limit=10`);
      if (response.status === 200) {
        const newRestaurants = response.data;

        // Check if there are more restaurants to load
        setHasMore(newRestaurants.length > 0);
        setRestaurants(prev => [...prev, ...newRestaurants]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more restaurants when the user scrolls down
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchRestaurants();
    }
  };

  // Handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    // You can call an API to search for restaurants, dishes, or categories based on `query`
    // Alternatively, filter `restaurants` array if data is available locally
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Toggle bookmark status
  const toggleBookmark = (restaurantId) => {
    setBookmarked((prev) => ({
      ...prev,
      [restaurantId]: !prev[restaurantId],
    }));
  };

  // Render each restaurant card
  const renderRestaurant = useCallback(({ item }) => {
  const { name, overall_rating, dishes, _id } = item;
  const isBookmarked = bookmarked[_id];
  
  // Display the first dish image or a default image
  const dishImage = (dishes.length > 0 && dishes[0].image_url) ? dishes[0].image_url : defaultDishImage;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: _id })} // Navigate to detail screen
    >
      {/* Dish Image */}
      <Image
        source={{ uri: dishImage }}
        style={styles.dishImage}
        resizeMode="cover"
      />
      
      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.restaurantName}>{name}</Text>
          {/* Bookmark Icon */}
          <TouchableOpacity onPress={() => toggleBookmark(_id)}>
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={isBookmarked ? '#FF6347' : '#555'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.restaurantRating}>Rating: {overall_rating || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
}, [bookmarked]);

  return (
    <View style={styles.container}>
      {/* Address Section */}
      <View style={styles.addressContainer}>
      <Icon name= "my-location" size = {24} color = 'red'/>
        <Text style={styles.addressText}>{userAddress}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes, restaurants, or categories"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
      </View>

      {/* Restaurants List */}
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#FF6347" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  addressContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  searchIcon: {
    marginLeft: 5,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dishImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantRating: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default HomeScreen;
