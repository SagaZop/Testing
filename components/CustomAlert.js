import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// Custom Alert Component
const CustomAlert = ({ type = 'success', message, visible, onHide }) => {
  const [slideAnim] = useState(new Animated.Value(-100)); // Initial slide value (above the screen)

  useEffect(() => {
    if (visible) {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to the top of the screen
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Automatically slide back up and hide after 3 seconds
      const hideTimeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100, // Slide back up off the screen
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 3000);

      // Cleanup on component unmount
      return () => clearTimeout(hideTimeout);
    }
  }, [visible, slideAnim, onHide]);

  if (!visible) return null;

  // Define background colors based on the type of alert
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'danger':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#17a2b8'; // Info type as default
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }], backgroundColor: getBackgroundColor() },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Adjust as needed to position the alert
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 20, // Make the border more rounded
    zIndex: 9999,
    elevation: 10, // For Android shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomAlert;
