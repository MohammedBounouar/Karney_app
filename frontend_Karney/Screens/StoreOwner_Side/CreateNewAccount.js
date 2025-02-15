import React, { useState } from 'react';
import { View, TextInput, Text , TouchableOpacity , StyleSheet  } from 'react-native';

import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import { endPoint } from '../../endpoint';
import { useFocusEffect } from '@react-navigation/native';



const CreateNewAccount = ({navigation}) => {
  const CurrentLanguage = useLanguage();
  const colorPicked = ColorPicker();

    const [state, setState] = useState({
        full_name :'',
        phone_number :'',
        email: '',
        password: '',
        CIN: '',
      });
      
      const handleInputChange = (text, fieldName) => {
        setState((prevState) => ({ ...prevState, [fieldName]: text }));
      };
      
      // const [LoggerType , setLoggerType] = useState(null);

      // Define the handleSelectType function outside of the useEffect hook
      // 

      // useEffect hook to run once on component mount
      // useEffectconst handleSelectType = (type) => {
      // //   setLoggerType(type);
      // //   console.log(type); // Logging the selected type here
      // // };(() => {
        // Call the handleSelectType function with the desired type
      //   handleSelectType(); // Example: set the initial type to 'customer'
      // }, []);
    
      const handleAddAccount = async () => {
        try {
          const NewAcc = await fetch(`${endPoint}/api/Store_Owners`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              full_name: state.full_name,
              phone_number: state.phone_number,
              email: state.email,
              password: state.password,
              CIN: state.CIN,
            }),
          });
          
          if (!NewAcc.ok) {
            throw new Error('Failed to add customer');
          }
          navigation.navigate('Login', { refresh: true });
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
           
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={styles.signInCard}>
      <Text style={{ textAlign: 'center' , fontSize : 20 , marginBottom : 10 }}>{dictionary[CurrentLanguage]?.create_new_account}</Text>
      <TextInput
        style={styles.input}
        placeholder={dictionary[CurrentLanguage]?.full_name}
        onChangeText={(text) => handleInputChange(text, 'full_name')}
        value={state.full_name}
      />
      <TextInput
        style={styles.input}
        placeholder={dictionary[CurrentLanguage]?.email}
        onChangeText={(text) => handleInputChange(text, 'email')}
        value={state.email}
      />
      <TextInput
        style={styles.input}
        placeholder={dictionary[CurrentLanguage]?.password}
        onChangeText={(text) => handleInputChange(text, 'password')}
        value={state.password}
      />
      <View style={{justifyContent : "space-between" , alignItems : "center", flexDirection : "row"}}>
      <TextInput
     style={[styles.input , {width : 130}]}
      placeholder={dictionary[CurrentLanguage]?.phone}
      onChangeText={(text) => handleInputChange(text, 'phone_number')}
      value={state.phone_number}
    />
      <TextInput
        style={[styles.input , {width : 130}]}
        placeholder={dictionary[CurrentLanguage]?.cin}
        onChangeText={(text) => handleInputChange(text, 'CIN')}
        value={state.CIN}
      />
      </View>
      {/* <View style={{justifyContent :'space-between' , flexDirection : 'row' , margin : 10 , padding : 4}}>
      <TouchableOpacity 
        style={[styles.radioButtonForType ,
        LoggerType === 'Customers' && { backgroundColor: colorPicked }]}
        onPress={() => handleSelectType('Customers')}>
        <Text style={[
          styles.radioButtonText
          ,LoggerType ==='Customers' && {color : 'white'}]}>
            Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={[styles.radioButtonForType , 
      LoggerType ==='Store_Owners' && { backgroundColor: colorPicked }]}
      onPress={() => handleSelectType('Store_Owners')}>
        <Text style={[
        styles.radioButtonText 
        ,LoggerType ==='Store_Owners' && {color : 'white'}]}>
          Store Owner</Text>
      </TouchableOpacity>
      </View> */}
      </View>
      <TouchableOpacity style={[styles.button ,{ backgroundColor : colorPicked}]} onPress={handleAddAccount}>
      <Text style={styles.buttonText}>{dictionary[CurrentLanguage]?.create}</Text>
    </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    button: {
      backgroundColor: '#6D9886',  // Set your desired background color
      borderRadius: 20,        // Adjust the borderRadius as needed
      padding: 15,
      alignItems: 'center',
      marginTop : 14
    },
    buttonText: {
      color: 'white',          // Set your desired text color
      fontSize: 16,
      fontWeight: 'bold',
    },
    signInCard: {
      backgroundColor: '#F6F5F5',
      padding: 20,
      borderRadius: 14,
      // Shadow properties
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.45,
      shadowRadius: 2.84,
      elevation: 9,
    },    
    radioTypeCard : {
      backgroundColor: '#F6F5F5',
      margin : 12,
      borderRadius: 14,
      // Shadow properties
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.45,
      shadowRadius: 2.84,
      elevation: 9,
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
      marginBottom: 10,
      padding: 5, 
      marginBottom: 20 ,
      },
      radioButtonForType: {
        // Add your styles for the radio button container
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey', // Add a default border color
      },
      radioButtonText: {
        // Add your styles for the radio button text
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', // Add a default text color
      },
  });

export default CreateNewAccount