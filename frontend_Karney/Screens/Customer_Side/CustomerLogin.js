import React, { useState, useEffect } from 'react';
import { View, TextInput, Text , TouchableOpacity , StyleSheet, Image, Modal  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the image from the assets folder
// import logoImage from '../assets/logo2.png';
import logoImage from '../../assets/logo2.png';

import dictionary from '../StoreOwner_Side/language.json';
import useLanguage from '../StoreOwner_Side/Translate';
import ColorPicker from '../StoreOwner_Side/ColorPicker';
import { endPoint } from '../../endpoint';


const CustomerLogin = ({ navigation }) => {

  // const [LoginAlert, setLoginAlert] = useState(false);


  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (text, fieldName) => {
    setState((prevState) => ({ ...prevState, [fieldName]: text }));
    seterrorInput(false);
  };

  const [Customers, setCustomers] = useState([]);

  useEffect(() => {

    fetch(`${endPoint}/api/Customers`, {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      return response.json();
    })
    .then(data => setCustomers(data.customer))
    .catch(error => {
      console.error('Error fetching customers:', error);
      // Handle network error, e.g., display error message to the user
    });
  }, []);

  const [errorInput, seterrorInput]=useState();

  const handleButtonPress = () => {
    const findCustomer = Customers.find(
      (Customer) => Customer.email === state.email && Customer.password === state.password
    );
  
    if (findCustomer) {
      // Passing parameters to MainScreen
      navigation.navigate('MainScreen', {
        id: findCustomer.id,
        full_name: findCustomer.full_name,
      });
  
      // Resetting the state
      setState({
        email: '',
        password: '',
      });
  
      // Return both customer ID and full name
      return {
        id: findCustomer.id,
        full_name: findCustomer.full_name,
      };
    } else {
      console.log('Error logging in');
      return null; // Return null if login failed
    }
  };

  const handleLogin = async () => {
    const customerData = handleButtonPress();
    if (customerData !== null) {
      // Log both customer ID and full name
      console.log('Logged in with account ID:', customerData.id, 'and full name:', customerData.full_name);
      alert('Logged in successfully');
    } else {
      seterrorInput('failed');
      console.log('Login failed');
    }
  };
  
  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={styles.image}>
        <Image
          source={logoImage}
          style={styles.logo}
        />
      </View>
      <TextInput
        style={[styles.input , errorInput === 'failed' && styles.errorInput]}
        placeholder={dictionary[CurrentLanguage]?.email}
        onChangeText={(text) => handleInputChange(text, 'email')}
        value={state.email}
      />
      <Text style={[ errorInput ==='failed' ?  {color : 'red' , fontSize : 10 , display : 'flex'} : {display : "none"}]}>
        please try again
      </Text>
      <TextInput
        style={[styles.input , errorInput === 'failed' && styles.errorInput]}
        placeholder={dictionary[CurrentLanguage]?.password}
        onChangeText={(text) => handleInputChange(text, 'password')}
        value={state.password}
      />
      <Text style={[ errorInput ==='failed' ?  {color : 'red' , fontSize : 10 , display : 'flex'} : {display : "none"}]}>
        please try again
      </Text>
      <TouchableOpacity style={[styles.LoginButton, { backgroundColor: colorPicked }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>{dictionary[CurrentLanguage]?.login}</Text>
      </TouchableOpacity>
    </View>


    {/* <Modal 
    animationType="fade"
    transparent={true}
    visible={LoginAlert}
    onRequestClose={() => {
      setLoginAlert(!LoginAlert);
    }}
    >
      <View style={{backgroundColor : '#ccc', justifyContent : 'center' , alignItems : "center" , height : 30 , 
        width : "50%" , borderRadius : 30,
      }}>
        <Text style={{color : 'white' }}>Login successfully</Text>
      </View>
    </Modal> */}
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
  createNewAccountButton:{
    marginVertical: 15,
    borderWidth : 1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.8,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input : {
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    padding: 5,
  },
  errorInput : {
    borderColor: 'red',
  }
});

export default CustomerLogin;
