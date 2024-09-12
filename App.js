// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text, View, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import BrowseRestaurants from './screens/BrowseRestaurants';
import InitialLoadingScreen from './screens/InitialLoadingScreen';
import logo from './assets/logo.png'
const Stack = createStackNavigator();

// Custom header with logo and title
const CustomHeaderTitle = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={logo} // Replace with your image path
        style={styles.logo}
      />
      <Text style={styles.headerText}>Zoppli</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InitialLoading">
        <Stack.Screen 
          name="InitialLoading" 
          component={InitialLoadingScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BrowseRestaurants" 
          component={BrowseRestaurants}
          options={{
            headerTitle: () => <CustomHeaderTitle />,  // Use the custom header component
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,  // Adjust size as needed
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
