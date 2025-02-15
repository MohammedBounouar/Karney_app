import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLanguage = () => {
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('language');
        if (value === 'ar' || value === 'en' || value === 'fr' || value === 'spn' || value === 'darija') {
          setLanguage(value);
        }
      } catch (error) {
        console.log('Error retrieving language data:', error);
      }
    };
    getData();
  }, []);

  return language;
};

export default useLanguage;
