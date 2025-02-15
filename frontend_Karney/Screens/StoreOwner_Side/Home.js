import React, { useState, useEffect , useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList,RefreshControl ,ScrollView, TouchableHighlight,Animated , Dimensions ,TouchableOpacity, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

import { AntDesign, MaterialIcons } from '@expo/vector-icons';


// Import Files
import SpinnerLoad from './Spinner';
import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import DeleteModal from './DeleteModal';

import { endPoint } from '../../endpoint';


const { width } = Dimensions.get('window');

export default function Home({ navigation }) {


  // Handle Delete Customer 

  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);

  const [showCustomerDialog, setShowCustomerDialog] = useState(false);


  const closeCustomerDialog = () => {setShowCustomerDialog(false)};
  // Open the dialog (for demonstration)
const openCustomerDialog = () => {setShowCustomerDialog(true)};

  // Change color
  const colorPicked = ColorPicker();
  // Change language
  const CurrentLanguage = useLanguage();

  const [modalVisible, setModalVisible] = useState(false);

  const [SearchIcon, setSearchIcon] = useState('search');

  const [InputVisibility, setInputVisibility] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current; // Initial position is 0
  const handleInputVisibility = () => {
    setInputVisibility(!InputVisibility);
    setSearchIcon(InputVisibility ? 'search' : 'search-off'); // Toggles SearchIcon

    // Animate the title when input visibility changes
    Animated.timing(translateY, {
      toValue: InputVisibility ? 0 : -30, // Move up when input is visible
      duration: 500, // Animation duration
      useNativeDriver: true,
    }).start();
  };

    


  const handleCustomerPress = (customerId, customerName) => {
    navigation.navigate('CustomerDetails', {
      id: customerId,
      full_name: customerName,
    });
  };
  

  // Handle all inputs to add a customer
  const [state, setState] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    CIN: '',
  });
  const handleInputChange = (text, fieldName) => {
    setState((prevState) => ({ ...prevState, [fieldName]: text }));
  };


  const [customers, setCustomers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [TotalOfTransactions, setTotalOfTransactions] = useState(null);

  const fetchData = async () => {
    try {
      const storeOwnerId = await AsyncStorage.getItem('Id');
      if (!storeOwnerId) {
        throw new Error('Store owner ID not found');
      }
      const response = await fetch(`${endPoint}/api/myCustomers/${storeOwnerId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  const [StoreOwner, setStoreOwner] = useState({});
  const fetchStoreOwner = async () => {
    try {
      const storeOwnerId = await AsyncStorage.getItem('Id');
      if (!storeOwnerId) {
        throw new Error('Store owner ID not found');
      }
      const response = await fetch(`${endPoint}/api/Store_Owners/${storeOwnerId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStoreOwner(data.storeOwner[0] || {}); 
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  // :::::::::::::::::::::::::::::::::::::::::::::::
  const [plan, setPlan] = useState({});
  const fetchHisPlan = async () => {
    try {
      const response = await fetch(`${endPoint}/api/Plans/${StoreOwner.plan_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
 
      setPlan(data.plan || {}); 
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  // ::::::::::::::::::::::::::::::::::::::::::::::::::
  const getTotalOfTransactions = async () => {
    try {
      const response = await fetch(`${endPoint}/api/TotalTrans`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTotalOfTransactions(data.total || []); // Default to empty array if data.total is undefined
    } catch (error) {
      console.error('Error fetching total transactions:', error);
    }
  };
  // :::::::::::::::::::::::::::::::::::::::::::::::::::

  const [TotalAmount, setTotalAmount] = useState(0);

    const GetTotalAmountOfAllCustomers = async () => {
      const storeOwnerId = await AsyncStorage.getItem('Id');
      
      if (!storeOwnerId) {
          throw new Error('Store owner ID not found');
      }
      try {
          const response = await fetch(`${endPoint}/api/store-owner/${storeOwnerId}/total-transactions`);
          
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          // console.log('Total Transactions:', data.totalTransactions);
          
          // Format to two decimal places if needed
          setTotalAmount(data.totalTransactions ? parseFloat(data.totalTransactions).toFixed(2) : '0.00');
          
          return data.totalTransactions;
          
      } catch (error) {
          console.error('Error fetching total transactions:', error);
      }
};
  // :::::::::::::::::::::::::::::::::::::::::::::::::::

  const [TotalCustomersCredit, setTotalCustomersCredit] = useState(0);

  const GetTotalCustomersWithCredit = async () => {
      const storeOwnerId = await AsyncStorage.getItem('Id');
      
      if (!storeOwnerId) {
          throw new Error('Store owner ID not found');
      }
      try {
          const response = await fetch(`${endPoint}/api/store-owner/${storeOwnerId}/total-CustomersWithCredit`);
          
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          // console.log('Number of Customers:', data.CustomersWithCredit);
          
          // Format to two decimal places if needed
          setTotalCustomersCredit(data.CustomersWithCredit ? data.CustomersWithCredit : '0');
          
          return data.CustomersWithCredit;
          
      } catch (error) {
          console.error('Error fetching total transactions:', error);
      }
  };




  // :::::::::::::::::::::::::::::::::::::::::::::::::::::
  const handleAddCustomer = async () => {
    try {
      const response = await fetch(`${endPoint}/api/Customers`, {
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

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      // Assuming you store the store owner's ID in AsyncStorage under the key 'storeOwnerId'
      const store_owner_id = await AsyncStorage.getItem('Id');

      // If you're using AsyncStorage to store the store owner's ID, make sure to parse it to an integer if needed
      const parsedStoreOwnerId = parseInt(store_owner_id);

      // Retrieve the newly added customer's ID from the response
      const { customer } = await response.json();
      const { id: customer_id } = customer;

      // Create a new object containing the IDs of the customer and the store owner
      const data = {
        store_owner_id: parsedStoreOwnerId,
        customer_id,
      };

      // Send a request to add the relationship to the pivot table
      const pivotResponse = await fetch(`${endPoint}/api/Add_Customer_StoreOwner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!pivotResponse.ok) {
        throw new Error('Failed to add customer-store owner relationship');
      }
        // Add the new customer to the list
        setCustomers(prevCustomers => [...prevCustomers, customer]);
        setModalVisible(false);
        alert('Account created successfully');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  // End adding fun

// Delete Customer
const handleDeleteCustomer = async () => {
  if (!customerToDeleteId) return;
  
  try {
    const response = await fetch(`${endPoint}/api/Customers/${customerToDeleteId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Handle successful deletion
      closeCustomerDialog(); // Close the dialog
      // Optionally, refresh the customer list or handle state updates
    } else {
      console.error('Failed to delete customer:', response.statusText);
      alert('Failed to delete customer. Please try again later.');
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    alert('Network error. Please check your internet connection and try again.');
  }
};

const handleLongPress = (customerId) => {
  setCustomerToDeleteId(customerId);
  setShowCustomerDialog(true);
};
  // :::::::::::::::::::::::::::::::::::::::::::::::::::

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchStoreOwner();
    await getTotalOfTransactions();
    await GetTotalAmountOfAllCustomers();
    await GetTotalCustomersWithCredit();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    fetchStoreOwner();
    getTotalOfTransactions();
    GetTotalAmountOfAllCustomers();
    GetTotalCustomersWithCredit();
  }, []);
  useEffect(() => {
    if (StoreOwner.plan_id) { // Ensure plan_id is available
      fetchHisPlan();
    }
  }, [StoreOwner.plan_id]); // Dependency array
  




  // Handle Search logic to search for a customer
  const [SearchInput, setSearchInput] = useState([]);

  const handleSearchInput = (text) => {
    const searchValue = text.toLowerCase(); // Convert text to lowercase
    const filtered = customers.filter((item) => {
      return (
        item.full_name.toString().toLowerCase().includes(searchValue)
      );
    });

    setSearchInput(filtered);
  };
  const renderData = SearchInput.length > 0 ? SearchInput : customers;

  // Function to generate initials from the full name
  const getInitials = (name) => {
    const initials = name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  };

  // Main component  :: Customers List
  const renderCustomer = ({ item }) => {
    const totalCredit = TotalOfTransactions && TotalOfTransactions
      .filter(transaction => transaction.CustomerID === item.id)
      .reduce((total, transaction) => total + parseFloat(transaction.Total), 0);
    return (
      <TouchableHighlight
        underlayColor="#DDDDDD"
        onPress={() => handleCustomerPress(item.id, item.full_name)}
        delayLongPress={400}
        onLongPress={() => handleLongPress(item.id)}
      >
  <View>
    {/* Using the DeleteDialog */}
    <DeleteModal
      show={showCustomerDialog}
      onClose={closeCustomerDialog}
      onDelete={handleDeleteCustomer}
      message="Are you sure you want to delete this customer? This action cannot be undone."
    />
    <View style={styles.customerItem}>
      {/* Custom Avatar component */}
      <View style={[styles.avatar, {
        backgroundColor:
        colorPicked === "#050C9C" ? "#0F67B1" :
        colorPicked === "#0E8388" ? "#37B7C3" :
        colorPicked === "#607274" ? "#393E46" :
        colorPicked === "#D65A31" ? "#373A40" :
          "#FFFFFF"
      }]}>
        <Text style={styles.avatarText}>{getInitials(item.full_name)}</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.full_name}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
      </View>
      <Text style={[styles.customerTotalCredit , {color : colorPicked}]}>
        {totalCredit?.toFixed(2) || "0.00"} {dictionary[CurrentLanguage]?.mad}
      </Text>
    </View>
  </View>
</TouchableHighlight>
    );
  };
  
// Interface////////////////////////////////////
  return (
    <>
      <SafeAreaView style={styles.container}> 
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={{ display: 'flex', alignItems: 'center' }} onPress={() => setModalVisible(false)}>
                <AntDesign name="caretdown" size={30} color="black" />
              </TouchableOpacity>
              <View style={styles.AddCard}>
                <Text style={styles.modalText}>{dictionary[CurrentLanguage]?.adding_customer}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  onChangeText={(text) => handleInputChange(text, 'full_name')}
                  value={state.full_name}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={(text) => handleInputChange(text, 'email')}
                  value={state.email}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  onChangeText={(text) => handleInputChange(text, 'phone_number')}
                  value={state.phone_number}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={(text) => handleInputChange(text, 'password')}
                  value={state.password}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CIN"
                  onChangeText={(text) => handleInputChange(text, 'CIN')}
                  value={state.CIN}
                />
              </View>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colorPicked }]}
                onPress={handleAddCustomer}>
                <Text style={styles.textStyle}>{dictionary[CurrentLanguage]?.add}</Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal>
        {/* End modal */}
        <LinearGradient
        colors={[
          colorPicked === "#050C9C" ? "#3FA2F6" :
          colorPicked === "#0E8388" ? "#29A19C" :
          colorPicked === "#607274" ? "#CCD3CA" :
          colorPicked === "#D65A31" ? "#686D76" :
          "#FFFFFF", colorPicked
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.curvedBackground}
        >
        <View style={styles.topContainer}>

          {/* Needs edit for logout 'Dropdown' */}
          <TouchableOpacity onPress={() => console.log('Logout')} >
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor:
                    colorPicked === "#050C9C" ? "#0F67B1" :
                    colorPicked === "#0E8388" ? "#37B7C3" :
                    colorPicked === "#607274" ? "#393E46" :
                    colorPicked === "#D65A31" ? "#373A40" :
                      "#FFFFFF"
                  }
                ]}
              >
              <Text style={styles.avatarText}>{StoreOwner.full_name ? getInitials(StoreOwner.full_name) : '..'}</Text>
            </View>
          </TouchableOpacity>
          {/* Needs edit for logout 'Dropdown' */}


          <View style={styles.IconStyle}>
            <TouchableOpacity onPress={() =>{customers.length < plan.customers_limit ? setModalVisible(true) 
            : alert('Please upgrade your plan to add more customers !')} }>
              <AntDesign name="adduser" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInputVisibility}>
              <MaterialIcons name={SearchIcon} size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Input */}
        {InputVisibility && (
          <View>
            <TextInput
              style={styles.SearchInput}
              placeholder={dictionary[CurrentLanguage]?.search_customer}
              onChangeText={(text) => handleSearchInput(text)}
            />
          </View>
        )}
        {/* Animated Title */}
        <Animated.View style={[styles.Home_Title, { transform: [{ translateY }] }]}>
          <Text style={styles.Home_Title_Text}>{StoreOwner.full_name ? StoreOwner.full_name : '...'}</Text>
        </Animated.View>
      </LinearGradient>


      <View style={styles.cardsContainer}>
      <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Plans')} >
        <View style={styles.header}>
          <Text style={styles.cardTitle}>{dictionary[CurrentLanguage]?.numbers_of_customers}</Text>
          <Text style={[styles.count, { color: colorPicked }]}>{customers.length >= 0 ? customers.length : '...'}/{plan.customers_limit ? plan.customers_limit : '..'}</Text>
        </View>
      </TouchableOpacity>
      </View>


      <View style={styles.card}>
      <TouchableOpacity onPress={() => console.log('Logout')} >
        <View style={styles.header}>
          <Text style={styles.cardTitle}>{dictionary[CurrentLanguage]?.total_credit}</Text>
          <Text style={[styles.count, { color: colorPicked }]}>{TotalAmount}{dictionary[CurrentLanguage]?.mad}</Text>
        </View>
      </TouchableOpacity>
      </View>

      <View style={styles.card}>
      <TouchableOpacity onPress={() => console.log('Logout')} >
        <View style={styles.header}>
          <Text style={styles.cardTitle}>{dictionary[CurrentLanguage]?.customers_need_to_pay}</Text>
          <Text style={[styles.count, { color: colorPicked }]}>{TotalCustomersCredit}</Text>
        </View>
      </TouchableOpacity>
      </View>

      </View>
        

        <View>
          <Text style={styles.description}>{dictionary[CurrentLanguage]?.customer_list}</Text>
        </View>
        {renderData ? (
            <FlatList
              data={renderData}
              keyExtractor={(item) => item.id.toString()} // Assuming item.id is numeric
              renderItem={renderCustomer}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <SpinnerLoad /> // Render spinner while data is being fetched
          )}
      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  // curved Shape 
  curvedBackground: {
    width: width,
    height: 200, // Adjust height as needed
    borderBottomRightRadius: 80, // Adjust curve radius
    overflow: 'hidden', // Ensures the gradient does not overflow
    padding: 0,
    marginBottom : 20,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  Home_Title_Text : {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
  },
  // //////////////////
  cardsContainer: {
    minWidth : width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: "nowrap", // Allows wrapping to the next row if there isn't enough space
    paddingHorizontal: 10, // Adjust as needed
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    width: 110, // Adjust the width as needed
    height: 100,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
   count:{
    fontSize : 15,
    fontWeight: 'bold',
    paddingTop : 15,
   },
  //  //////////////////////
  description : {
    fontSize : 17,
    fontWeight: 'bold',
    paddingTop : 15,
    marginHorizontal : 20,
  },
  // Custom Avatar styles
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  // Other styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingHorizontal: 15,
    marginVertical : 17,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  IconStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customerInfo: {
    marginLeft: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerEmail: {
    fontSize: 14,
    color: '#888',
    letterSpacing : 1,
  },
  customerTotalCredit: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent : "flex-end",
    alignItems :"flex-end",
    marginHorizontal : 5
  },
  centeredView: {
    flex: 1, 
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width : width,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: 300,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 0.8,
    // borderBottomWidth : 1,
    borderRadius: 10,  // Add this line to set the border radius
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  SearchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical : 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical : 10 ,
    color : "white",
  },
});
