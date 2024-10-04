import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const RestaurantDetailScreen = ({ route }) => {
  const { restaurantId } = route.params; // Retrieve restaurantId from params
  console.log(restaurantId)
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        // Fetch restaurant information
        const restaurantResponse = await axios.get(
          `http://10.0.2.2:5000/api/restaurant/${restaurantId}`
        );
        console.log(restaurantResponse.data)
        setRestaurant(restaurantResponse.data);

        // Fetch dishes for the restaurant
        const dishesResponse = await axios.get(
          `http://10.0.2.2:5000/api/dish?restaurant_id=${restaurantId}`
        );
        setDishes(dishesResponse.data);
      } catch (error) {
        console.error('Failed to fetch restaurant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Restaurant Information */}
      {restaurant && (
        <View style={styles.restaurantInfoContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDetail}>
            Address: {restaurant.address_id.street}, {restaurant.address_id.city}
          </Text>
          <Text style={styles.restaurantDetail}>Rating: {restaurant.overall_rating}</Text>
          <Text style={styles.restaurantDetail}>
            Delivery Time: {restaurant.delivery_time_estimate}
          </Text>
        </View>
      )}

      {/* Dishes */}
      <Text style={styles.sectionTitle}>Dishes</Text>
      <FlatList
        data={dishes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.dishCard}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.dishImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.dishName}>{item.name}</Text>
              </View>
            )}
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.dishDetail}>Price: ₹{item.price}</Text>
            <Text style={styles.dishDetail}>Category: {item.category_id.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfoContainer: {
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  restaurantDetail: {
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dishCard: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dishImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishDetail: {
    fontSize: 16,
    color: '#555',
  },
});

export default RestaurantDetailScreen;
