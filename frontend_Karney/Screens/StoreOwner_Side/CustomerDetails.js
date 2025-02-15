import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
  SectionList,
  ScrollView,
} from 'react-native';
import { Ionicons, AntDesign, FontAwesome6, MaterialIcons } from '@expo/vector-icons';

import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import SpinnerLoad from './Spinner';
import DeleteModal from './DeleteModal';
import { endPoint } from '../../endpoint';



const { width } = Dimensions.get('window');


const CustomerDetails = ({ route, navigation }) => {
  
  const { id: customerId, full_name: customerName } = route.params;

  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  const closeTransactionDialog = () => {
    setShowTransactionDialog(false);
  };
  const openTransactionDialog = () => {
    setShowTransactionDialog(true);
  };

  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);

// display Modal for adding transaction
  const [modalVisible, setModalVisible] = useState(false);

  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [total, setTotal] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ading transacion state
  const [state, setState] = useState({
    CustomerID: '',
    produit_bought: '',
    Quantity_bought: '',
    produit_price: '',
  });
  const handleInput = (text, fieldName) => {
    setState(prevState => ({ ...prevState, [fieldName]: text }));
  };


  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();


  const fetchData = async () => {
    try {
      // Fetch transactions
      const transactionsResponse = await fetch(`${endPoint}/api/Transactions/${customerId}`);
      if (!transactionsResponse.ok) throw new Error('Network response was not ok');
      const transactionsData = await transactionsResponse.json();
  
      // Check if transactionsData.transactions is an array
      if (!Array.isArray(transactionsData.transactions)) {
        throw new Error('Transactions data is not an array');
      }
  
      // Group transactions by date
      const groupedTransactions = transactionsData.transactions.reduce((acc, transaction) => {
        const date = transaction.created_at?.split('T')[0];
        if (!date) {
          console.warn('Transaction missing created_at date:', transaction);
          return acc;
        }
        if (!acc[date]) acc[date] = [];
        acc[date].push(transaction);
        return acc;
      }, {});
  
      // Format transactions for display
      const formattedTransactions = Object.keys(groupedTransactions).reverse().map(date => ({
        title: date,
        data: groupedTransactions[date],
      }));
  
      // Set transactions or an empty array if no transactions
      setCustomerTransactions(formattedTransactions.length > 0 ? formattedTransactions : []);
  
      // Fetch total transactions
      const totalResponse = await fetch(`${endPoint}/api/TotalTrans/${customerId}`);
      if (!totalResponse.ok) throw new Error('Network response was not ok');
      const totalData = await totalResponse.json();
  
      // Set total transactions or default to 0 if totalData.totalTrans is not available
      setTotal(totalData.totalTrans ?? 0);
  
    } catch (error) {
      console.error('Error fetching data:', error.message);
  
      // Optionally set default values in case of an error
      setCustomerTransactions([]);
      setTotal(0);
    }
  };
  
  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  useEffect(() => {
    fetchData();
  }, []);


// add transaction function : 
  const handleTransaction = async () => {
    try {
      const response = await fetch(`${endPoint}/api/Transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          CustomerID: customerId,
          produit_bought: state.produit_bought,
          Quantity_bought: state.Quantity_bought,
          produit_price: state.produit_price,
        }),
      });

      if (!response.ok) throw new Error('Failed to add transaction');
      alert('Transaction created successfully');
      setModalVisible(false);
      // Reset the input fields
    setState({
      CustomerID: '',
      produit_bought: '',
      Quantity_bought: '',
      produit_price: '',
    });

    // Optionally refresh the transactions list to show the new transaction
    await fetchData();
    
    } catch (error) {
      console.error('Error:', error.message);
    }
  };



  const handleDeleteTransaction = async () => {
    try {
      const response = await fetch(`${endPoint}/api/Transactions/${transactionToDeleteId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        closeTransactionDialog(); // Close the dialog
      } else {
        alert('Failed to delete transaction.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };
  


  const formatDate = (dateString) => {
    const options = { year: 'numeric' , month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
   // Function to generate initials from the full name
   const getInitials = (name) => {
    if (!name) return ''; // Check if the name is undefined or empty
  
    const initials = name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
      
    return initials;
  };
  

  const renderItem = ({ item }) => (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.item}
        delayLongPress={400}
        onLongPress={() => {
          setShowTransactionDialog(true);
          setTransactionToDeleteId(item.id);
        }}
        activeOpacity={0.6}
      >
        <DeleteModal
          show={showTransactionDialog}
          onClose={closeTransactionDialog}
          onDelete={handleDeleteTransaction}
          message="Are you sure you want to delete this transaction? This action cannot be undone."
        />
        <View style={styles.keyQte}>
          <Text style={styles.key}>{item.produit_bought}</Text>
          <Text style={[styles.Qte, { color: colorPicked }]}>
            {item.Quantity_bought} x {item.produit_price} {dictionary[CurrentLanguage]?.unit_price}
          </Text>
        </View>
        <Text style={[styles.value, {
                    backgroundColor:
                    colorPicked === "#050C9C" ? "#0F67B1" :
                    colorPicked === "#0E8388" ? "#37B7C3" :
                    colorPicked === "#607274" ? "#393E46" :
                    colorPicked === "#D65A31" ? "#373A40" :
                      "#FFFFFF"
                  }]}>
          {item.produit_price * item.Quantity_bought} {dictionary[CurrentLanguage]?.mad}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
  
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.dateHeader}>{formatDate(title)}</Text>
  );
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.nav} onPress={() => navigation.navigate('MainApp')}>
          <Ionicons name="chevron-back-sharp" size={24} color="#393E46" />
        </TouchableOpacity>

        <View style={[styles.avatar, {
                    backgroundColor:
                    colorPicked === "#050C9C" ? "#0F67B1" :
                    colorPicked === "#0E8388" ? "#37B7C3" :
                    colorPicked === "#607274" ? "#393E46" :
                    colorPicked === "#D65A31" ? "#373A40" :
                      "#FFFFFF"
                  }]}>
            <Text style={styles.avatarText}>{getInitials(customerName)}</Text>
          </View>
          <Text style={styles.title} >{customerName}</Text>


        <TouchableOpacity style={styles.iconAdd} onPress={() => setModalVisible(true)}>
          <FontAwesome6 name="add" size={24} color="#393E46" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{ display: 'flex', alignItems: 'center', marginTop: -30, marginBottom: 30 }}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="caretdown" size={24} color="#393E46" />
              </TouchableOpacity>
              <Text style={styles.modalText}>{dictionary[CurrentLanguage]?.adding_product}</Text>
              <TextInput
                style={styles.input}
                placeholder="Product name"
                onChangeText={(text) => handleInput(text, 'produit_bought')}
                value={state.produit_bought}
              />
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                onChangeText={(text) => handleInput(text, 'Quantity_bought')}
                value={state.Quantity_bought}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                onChangeText={(text) => handleInput(text, 'produit_price')}
                value={state.produit_price}
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose, { backgroundColor: colorPicked }]}
                onPress={handleTransaction}
              >
                <Text style={styles.textStyle}>{dictionary[CurrentLanguage]?.add}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {customerTransactions ? (
          <SectionList
            sections={customerTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            refreshing={refreshing}
            onRefresh={onRefresh}

        />
        ) : (
          <SpinnerLoad />
        )}
        <View style={styles.CustomerDetailsFooter}>
          <View style={styles.additionalInfo}>
            <Text style={styles.TotalCredit}>
              {dictionary[CurrentLanguage]?.total_credit} :
              {total ? total.find(item => item.Total)?.Total || '0.00' : 'Loading...'}
              {dictionary[CurrentLanguage]?.mad}
            </Text>
          </View>
          <TouchableOpacity style={[styles.PayButton , {
                    backgroundColor:
                    colorPicked === "#050C9C" ? "#0F67B1" :
                    colorPicked === "#0E8388" ? "#37B7C3" :
                    colorPicked === "#607274" ? "#393E46" :
                    colorPicked === "#D65A31" ? "#373A40" :
                      "#FFFFFF"
                  }]}>
            <MaterialIcons name="payment" size={24} color="#F7F7F7" />
            <Text style={{ color: '#F7F7F7', marginLeft: 5 }}>{dictionary[CurrentLanguage]?.pay}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 70,
    marginBottom: 10,
  },
  nav: {
    width: 30,
  },
  iconAdd: {
    width: 30,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal : 15,
    textAlign: 'center',
    flex: 1,
  },
  // Custom Avatar styles
  Editingavatar : {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical : 30,
  },
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
  dateHeader: {
    fontSize: 13,
    margin : 5,
    color: '#222',
    justifyContent : 'flex-start',
    alignItems : 'flex-start',
  },
  item: {
    backgroundColor: '#f6f6f6',
    display: 'flex',
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    // Apply Shadow 
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 1, height: 3 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 3, // Shadow radius
    elevation: 4, // Required for Android to apply shadow
  },  
  keyQte: {
    marginLeft: 5,
  },
  key: {
    fontWeight: '500',
    color: '#252525',
    opacity: 0.9,
    fontSize: 22,
  },
  Qte: {
    display: 'flex',
    fontSize: 14,
    marginLeft: 2,
  },
  value: {
    minWidth: 100,
    borderRadius: 14,
    textAlign: 'center',
    fontWeight: '700',
    color: '#fff',
    padding: 9,
    fontSize: 14,
  },
  additionalInfo: {
    textAlign: 'center',
    marginTop: 20,
  },
  TotalCredit: {
    color: '#000',
    fontWeight: '500',
    fontSize: 18,
  },
  PayButton : {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 10,
    maxWidth: 100,
    zIndex: 1,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width,
    height: 1100,
    marginTop: 900,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  EditingmodalView: {
    width: width,
    height: 1600,
    marginTop: 900,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
    padding: 15,
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
    marginBottom: 20,
  },
  CustomerDetailsFooter: {
    minWidth: width,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //:::::::::::::::::::::::::::::::
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  EditingmodalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  modalCloseButton: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  Editingavatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  modalInput: {
    marginVertical: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  smallInput: {
    width: '48%', // Ensure both inputs fit side by side
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomerDetails;
