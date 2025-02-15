import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
// Import the image from the assets folder
import logoImage from '../../assets/logo2.png';

const LoadingScreen = ({ navigation }) => {
  const [dropAnimation] = useState(new Animated.Value(-400)); // Initial position off the screen

  useEffect(() => {
    Animated.timing(
      dropAnimation,
      {
        toValue: 0, // Final position at the top of the screen
        duration: 1000, // Duration of the animation in milliseconds
        useNativeDriver: true,
      }
    ).start(); // Start the animation
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: dropAnimation }] }]}>
        <Image
          source={logoImage}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop : -210,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default LoadingScreen;
