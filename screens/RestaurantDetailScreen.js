import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const RestaurantDetailScreen = ({ route }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultDishImage = 'http://10.0.2.2:5000/images/default-dish.png';

  // Fetch restaurant details based on ID
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:5000/api/restaurant/${restaurantId}`);
        if (response.status === 200) {
          setRestaurant(response.data);
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Restaurant details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Restaurant Name and Details */}
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.address}>{restaurant.address_id.street}, {restaurant.address_id.city}</Text>

      {/* Categories and Dishes */}
      <Text style={styles.sectionTitle}>Dishes</Text>
      <FlatList
        data={restaurant.dishes}
        keyExtractor={(dish) => dish._id}
        renderItem={({ item }) => (
          <View style={styles.dishCard}>
            <Image
              source={{ uri: item.image_url || defaultDishImage }}
              style={styles.dishImage}
            />
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishPrice}>${item.price}</Text>
            </View>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dishCard: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dishImage: {
    width: 100,
    height: 100,
  },
  dishInfo: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishPrice: {
    fontSize: 16,
    color: '#555',
  },
});

export default RestaurantDetailScreen;
