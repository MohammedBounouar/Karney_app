import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet,Dimensions, FlatList,ScrollView, TextInput, Alert as RNAlert , RefreshControl  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// import RNRestart from 'react-native-restart';
// import { Ionicons, AntDesign } from '@expo/vector-icons';

// import Ar from '../assets/ar.png';
// import Fr from '../assets/fr.png';
// import En from '../assets/en.png';

import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import SpinnerLoad from './Spinner';
import { endPoint }  from '../../endpoint';


const { width } = Dimensions.get('window');


const Account = () => {
  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();

  const [selectedOption, setSelectedOption] = useState(null);
  const [DisplayAlert, setDisplayAlert] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

  const [state, setState] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    CIN: '',
  });

  const handleInputChange = (text, fieldName) => {
    setState((prevState) => ({ ...prevState, [fieldName]: text }));
    setUpdateButton(true);
  };

  // Change language Function
  const handleSelect = async (option) => {
    try {
      setSelectedOption(option);
      setDisplayAlert(true);
      await AsyncStorage.setItem('language', option);
      console.log('Language saved successfully:', option);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  useEffect(() => {
    if (CurrentLanguage !== null) {
      setSelectedOption(CurrentLanguage);
    }
  }, [CurrentLanguage]);

  // State to manage input fields visibility for each item
  // const [inputVisibility, setInputVisibility] = useState({
  //   full_name: false,
  //   email: false,
  //   password: false
  // });

  // const toggleInputVisibility = (key) => {
  //   setInputVisibility(prevState => ({
  //     ...prevState,
  //     [key]: !prevState[key]
  //   }));
  // };

  // Change App's Color Function
  const [selectedColor, setSelectedColor] = useState(null);
  const handleSelectColor = async (color) => {
    try {
      setSelectedColor(color);
      setDisplayAlert(true);
      await AsyncStorage.setItem('Color', color);
      console.log('Color saved successfully:', color);
    } catch (error) {
      console.error('Error saving color:', error);
    }
  };

  useEffect(() => {
    if (colorPicked !== null) {
      setSelectedColor(colorPicked);
    }
  }, [colorPicked]);
  

  const [storeOwners, setStoreOwners] = useState([]);

  const fetchData = async () => {
    try {
      const storeOwnerId = await AsyncStorage.getItem('Id');
      const result = await fetch(`${endPoint}/api/Store_Owners/${storeOwnerId}`, {
        method: 'GET'
      });
      if (!result.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await result.json();
      setStoreOwners(data.storeOwner || []); // Ensure it's an array
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };
  // console.log(storeOwners.full_name);
  

  useEffect(() => {
    fetchData();
  }, []);

  const UpdateData = async () => {
    try {
      const storeOwnerId = await AsyncStorage.getItem('Id');
      const result = await fetch(`${endPoint}/api/Store_Owners/${storeOwnerId}`, {
        method: 'GET'
      });
      if (!result.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await result.json();
      const storeOwnerData = data.storeOwner[0];

      const updatedData = {
        full_name: state.full_name !== '' ? state.full_name : storeOwnerData.full_name,
        email: state.email !== '' ? state.email : storeOwnerData.email,
        password: state.password !== '' ? state.password : storeOwnerData.password,
        phone_number: state.phone_number !== '' ? state.phone_number : storeOwnerData.phone_number,
        CIN: state.CIN !== '' ? state.CIN : storeOwnerData.CIN,
      };

      const response = await fetch(`${endPoint}/api/Store_Owners/${storeOwnerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedDataResponse = await response.json();
        setStoreOwners([updatedDataResponse]); // Update state
        setUpdateButton(false);
        setDisplayAlert(true);
      } else {
        throw new Error('Failed to update store owner data');
      }
    } catch (error) {
      console.error('Error updating store owner data:', error);
    }
  };

  // Refresh page
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    const color = await AsyncStorage.getItem('Color');
    setSelectedColor(color);
    const language = await AsyncStorage.getItem('language');
    setSelectedOption(language);
    setRefreshing(false);
  };
  
  // Function to generate initials from the full name
  const getInitials = (name) => {
    const initials = name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  };
  return (
    <>
      <SafeAreaView style={styles.editSection}>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.nav}>
          <Text style={styles.navText}>{dictionary[CurrentLanguage]?.account}</Text>
        </TouchableOpacity>

        {/* Conditionally render avatar and initials */}
        {storeOwners.length > 0 && storeOwners[0].full_name ? (
            <View style={[styles.avatar, {
              backgroundColor:
              colorPicked === "#050C9C" ? "#0F67B1" :
              colorPicked === "#0E8388" ? "#37B7C3" :
              colorPicked === "#607274" ? "#393E46" :
              colorPicked === "#D65A31" ? "#373A40" :
                "#FFFFFF"
            }]}>
              <Text style={styles.avatarText}>{getInitials(storeOwners[0].full_name)}</Text>
            </View>
          ) : (
            <SpinnerLoad /> // Render spinner while data is being fetched
          )}

      </View>
        <View style={styles.innerContainer}>
          <FlatList
            data={storeOwners}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.item}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new value"
                    onChangeText={(text) => handleInputChange(text, 'full_name')}
                    value={state.full_name || item.full_name}
                  />
                <Text style={styles.item}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new value"
                    onChangeText={(text) => handleInputChange(text, 'email')}
                    value={state.email || item.email}
                  />
                <Text style={styles.item}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new value"
                    onChangeText={(text) => handleInputChange(text, 'password')}
                    value={state.password || item.password}
                  />
              </View>
            )}
          />
          {updateButton && (
            <TouchableOpacity onPress={UpdateData} style={[styles.updateButton, { backgroundColor: colorPicked }]}>
              <Text style={styles.updateText}>{dictionary[CurrentLanguage]?.update}</Text>
            </TouchableOpacity>
          )}
        </View>
{/* ///////////////////////////////////////////////////////// */}
          <View style={styles.customization}>

        <View style={styles.colorPalette}>
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#050C9C' }, selectedColor === '#050C9C' && styles.selectedColor]}
            onPress={() => handleSelectColor('#050C9C')}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#0E8388' }, selectedColor === '#0E8388' && styles.selectedColor]}
            onPress={() => handleSelectColor('#0E8388')}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#607274' }, selectedColor === '#607274' && styles.selectedColor]}
            onPress={() => handleSelectColor('#607274')}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#D65A31' }, selectedColor === '#D65A31' && styles.selectedColor]}
            onPress={() => handleSelectColor('#D65A31')}
          />
        </View>
        
        <View style={[styles.pickerContainer , {backgroundColor : colorPicked}]}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => handleSelect(itemValue)}
            style={[styles.picker ,{
              backgroundColor:
              colorPicked === "#050C9C" ? "#0F67B1" :
              colorPicked === "#0E8388" ? "#37B7C3" :
              colorPicked === "#607274" ? "#393E46" :
              colorPicked === "#D65A31" ? "#373A40" :
                "#FFFFFF"
            }]}
            dropdownIconColor="#fff" // Optional, changes the dropdown arrow color
          >
            <Picker.Item label="English"  value="en" />
            <Picker.Item label="Français" value="fr" />
            <Picker.Item label="Spanish"  value="spn" />
            <Picker.Item label="العربية"  value="ar" />
            <Picker.Item label="الدارجة"  value="darija" />
          </Picker>
        </View>
      <View style={styles.Copyright}>
      <Text style={styles.Copyright_text}>Developed by <Text style={{textDecorationLine : 'underline'}}>Bounouar Mohammed </Text>©</Text>
      </View>
         
      </View>

      </SafeAreaView>
      
    </>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    marginTop : 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin : 5,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editSection: {
    flex: 1,
    width : width,
    backgroundColor: '#fff',
    padding: 20,
  },
  innerContainer: {
    flex: 1,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButton: {
    marginBottom: 20,
  },
  editText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // ///////////////////////////////
  customization : {
    flex : 1,
    flexDirection: "column",
  },
  // //////////
  colorPalette: {
    flexDirection: "row",
    justifyContent: 'space-between',
    padding : 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginVertical :5,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  // picker
  pickerContainer: {
    borderRadius: 30,
    overflow: 'hidden', // Ensures the picker conforms to the border radius
    justifyContent : "center",
    textAlign : "center",
  },
  picker: {
    width: '100%',
    color: '#fff',
  },
  Copyright: {
    marginTop : 20,
    justifyContent: 'center',  
    alignItems: 'center', 
  },
  Copyright_text: {
    fontSize: 16,
    fontWeight : "500",
  },
});

export default Account;
