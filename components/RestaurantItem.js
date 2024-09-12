// components/RestaurantItem.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RestaurantItem = ({ restaurant }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <Image source={{ uri: restaurant.imageUrl || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.type}>Business Type: {restaurant.business_type}</Text>
        <Text style={styles.address}>{restaurant.address_id?.street || 'No Address Available'}</Text>
        <Text style={styles.time}>Delivery Time: {restaurant.delivery_time_estimate || 'N/A'} mins</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: 100,
    height: 100,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  type: {
    color: '#666',
    marginTop: 5,
  },
  address: {
    color: '#888',
    marginTop: 3,
  },
  time: {
    marginTop: 5,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default RestaurantItem;
