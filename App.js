import React, { useEffect, useState, createContext, useContext } from 'react';
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
import PasswordResetScreen from './screens/PasswordResetScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CustomAlert from './components/CustomAlert'; // Import your CustomAlert component
import { initializeApp } from './utils/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create Alert Context
const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

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
      initialRouteName={isLoggedIn ? 'MainHome' : 'Login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainHome" component={HomeTabNavigator} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="ResetPassword" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Alert state management
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  // Function to show alert
  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Function to hide alert
  const hideAlert = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        const accessToken = await initializeApp();
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <NavigationContainer>
        <MainStackNavigator isLoggedIn={isLoggedIn} />
        {/* CustomAlert will be visible above all other components */}
        <CustomAlert
          type={alertType}
          message={alertMessage}
          visible={alertVisible}
          onHide={hideAlert}
        />
      </NavigationContainer>
    </AlertContext.Provider>
  );
};

export default App;
