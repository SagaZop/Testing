import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RestaurantDetailScreen from './screens/RestaurantDetailScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import { initializeApp } from './utils/auth'; // Import your utility function for token check

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'UserTab') {
            iconName = 'person';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === 'HomeTab') {
            label = 'Home';
          } else if (route.name === 'UserTab') {
            label = 'User';
          }
          return <Text style={{ color: focused ? '#FF6347' : '#555' }}>{label}</Text>;
        },
        tabBarStyle: { height: 60, paddingBottom: 5 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="UserTab" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

const MainStackNavigator = ({ isLoggedIn }) => {
  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'MainHome' : 'Login'} // Redirect based on login status
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainHome" component={HomeTabNavigator} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen}/>
    </Stack.Navigator>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        // Check token status and update login status
        const accessToken = await initializeApp(); // Function to initialize token status
        if (accessToken) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Token check error:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkTokenStatus();
  }, []);

  if (loading) {
    // Show loading indicator while checking token status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainStackNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
};

export default App;
