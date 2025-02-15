import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Import the image from the assets folder
import logoImage from '../../assets/logo2.png';

import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import { endPoint } from '../../endpoint';
import Alerts from '../Components/Alerts';

const Login = ({ navigation, route }) => {
  const [LoginAlert, setLoginAlert] = useState(false);
  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const [storeOwners, setStoreOwners] = useState([]);
  const [errorInput, setErrorInput] = useState(false);

  // Fetch store owners data on component mount
  useEffect(() => {
    fetchStoreOwners();
  }, []);

  // Fetch store owners data
  const fetchStoreOwners = async () => {
    try {
      const response = await fetch(`${endPoint}/api/Store_Owners`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      const data = await response.json();
      setStoreOwners(data.storeOwner);
    } catch (error) {
      console.error('Error fetching Store_Owners:', error);
      Alert.alert('Error', 'Failed to fetch store owners. Please try again.');
    }
  };

  // Handle input change
  const handleInputChange = (text, fieldName) => {
    setState((prevState) => ({ ...prevState, [fieldName]: text }));
    setErrorInput(false);
  };

  // Handle login button press
  const handleLogin = async () => {
    const foundOwner = storeOwners.find(
      (owner) => owner.email === state.email && owner.password === state.password
    );

    if (foundOwner) {
      // Save the logged-in user's ID to AsyncStorage
      await AsyncStorage.setItem('Id', JSON.stringify(foundOwner.id));
      console.log('Logged in with account ID:', foundOwner.id);

      // Reset the form
      setState({
        email: '',
        password: '',
      });

      // Navigate to the main app
      navigation.navigate('MainApp');
    } else {
      // Show error message
      setErrorInput(true);
      setLoginAlert(true);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setLoginAlert(false);
      }, 3000);
    }
  };

  // Handle focus effect to refresh data if needed
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.refresh) {
        fetchStoreOwners(); // Refresh store owners data
      }
    }, [route.params?.refresh])
  );

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <View style={styles.image}>
          <Image source={logoImage} style={styles.logo} />
        </View>

        <TextInput
          style={[styles.input, errorInput && styles.errorInput]}
          placeholder={dictionary[CurrentLanguage]?.email}
          onChangeText={(text) => handleInputChange(text, 'email')}
          value={state.email}
          keyboardType="email-address"
        />
        {errorInput && (
          <Text style={styles.errorText}>Please check your email and password.</Text>
        )}

        <TextInput
          style={[styles.input, errorInput && styles.errorInput]}
          placeholder={dictionary[CurrentLanguage]?.password}
          onChangeText={(text) => handleInputChange(text, 'password')}
          value={state.password}
          secureTextEntry
        />
        {errorInput && (
          <Text style={styles.errorText}>Please check your email and password.</Text>
        )}

        <TouchableOpacity
          style={[styles.LoginButton, { backgroundColor: colorPicked }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>{dictionary[CurrentLanguage]?.login}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createNewAccountButton}
          onPress={() => navigation.navigate('Create new account')}
        >
          <Text style={[styles.buttonText, { color: colorPicked }]}>
            {dictionary[CurrentLanguage]?.create_new_account}!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerLogin')}
          style={styles.ImCustomer}
        >
          <Text style={{ color: colorPicked, fontSize: 17 }}>I'm a Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Show the alert only when LoginAlert is true */}
      {LoginAlert && <Alerts messageAlert={'Your email or password is incorrect'} />}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  LoginButton: {
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  createNewAccountButton: {
    marginVertical: 15,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.8,
    fontWeight: 'bold',
  },
  ImCustomer: {
    alignItems: 'flex-end',
    marginHorizontal: 20,
    opacity: 0.8,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    padding: 5,
  },
  errorInput: {
    borderColor: 'ccc',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Login;