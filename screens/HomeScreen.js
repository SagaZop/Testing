import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAlert } from '../App'; // Import useAlert hook

const HomeScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Access the showAlert function
  const { showAlert } = useAlert();

  // Placeholder image in case no image is available for a category or restaurant.
  const defaultDishImage = 'http://10.0.2.2:5000/images/default-dish.png';

  
  // Fetch categories and restaurants from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          `http://10.0.2.2:5000/api/categories`,
        );
        setCategories(categoryResponse.data);

        const restaurantResponse = await axios.get(
          `http://10.0.2.2:5000/api/restaurant`,
        );
        setRestaurants(restaurantResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showAlert('danger', 'Failed to fetch data. Please try again.'); // Show custom alert
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render a single category item
  const renderCategory = ({item}) => (
    <TouchableOpacity style={styles.categoryItem}>
      {item.image_url ? (
        <Image source={{uri: item.image_url}} style={styles.categoryImage} />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render a single restaurant item with custom styling
  const renderRestaurant = ({item}) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() =>
        navigation.navigate('RestaurantDetail', {restaurantId: item._id})
      }>
      {/* Restaurant Image or Fallback */}
      {item.dishes[0]?.image_url ? (
        <Image
          source={{uri: item.dishes[0].image_url}}
          style={styles.restaurantImage}
        />
      ) : (
        <View style={styles.noImageRestaurantContainer}>
          <Text style={styles.restaurantName}>{item.name}</Text>
        </View>
      )}

      {/* Restaurant Details */}
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantCategory}>
          {item.category || 'Various cuisines'}
        </Text>
        <Text style={styles.environmentInfo}>
          <Icon name="eco" size={16} color="green" /> Zoppli funds environmental
          projects to offset delivery carbon footprint
        </Text>

        {/* Rating and Price Section */}
        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              {item.overall_rating || 'N/A'}{' '}
              <Icon name="star" size={16} color="white" />
            </Text>
          </View>
          <Text style={styles.priceText}>
            ₹{item.price_for_one || '100'} for one
          </Text>
        </View>

        {/* Safety Badge */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>MAX SAFETY DELIVERY</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header with Address and Search Bar */}
      <View style={styles.header}>
        <Text style={styles.addressText}>
          2/15In front of Basera girls hostel, Near street
        </Text>
        <TouchableOpacity style={styles.languageIcon}>
          <Icon name="translate" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Restaurant name or a dish..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
      </View>

      {/* Categories Section */}
      <Text style={styles.sectionTitle}>WHAT'S ON YOUR MIND?</Text>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          style={{paddingLeft: 10}}
        />
      ) : (
        <Text style={styles.noCategoriesText}>No categories found</Text>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Restaurants Section */}
      <Text style={styles.sectionTitle}>ALL RESTAURANTS</Text>
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.restaurantList}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  searchIcon: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  categoriesList: {
    marginBottom: 15,
  },
  categoryItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryName: {
    marginTop: 5,
    textAlign: 'center',
  },
  noCategoriesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantDetails: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  restaurantCategory: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  environmentInfo: {
    fontSize: 12,
    color: '#777',
    marginVertical: 5,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ratingContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
    color: '#555',
  },
  badgeContainer: {
    backgroundColor: '#FF9900',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurantList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
  },
  noImageRestaurantContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
