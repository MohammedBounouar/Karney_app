import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ColorPicker = () => {
    const [color, setColor] = useState('#0E8388'); // Default color
    useEffect(() => {
        // Fetch color from AsyncStorage when component mounts
        AsyncStorage.getItem('Color').then((value) => {
          if (value) {
            setColor(value);
          }
        }).catch(error => {
          console.error('Error fetching color:', error);
        });
      }, []);
  return color
}

export default ColorPicker