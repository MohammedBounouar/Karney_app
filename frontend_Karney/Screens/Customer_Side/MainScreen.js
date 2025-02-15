import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Dimensions,
  Modal,
  SectionList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import dictionary from '../StoreOwner_Side/language.json';
import useLanguage from '../StoreOwner_Side/Translate';
import ColorPicker from '../StoreOwner_Side/ColorPicker';
import { endPoint } from '../../endpoint';

const { width } = Dimensions.get('window');

const MainScreen = ({ route }) => {
  const { id: customerId, full_name: customerName } = route.params;
  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();

  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [total, setTotal] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [CustomerPic, setCustomerPic] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const [state, setState] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  // Fetch customer profile image
  const GetCustomerPic = async () => {
    try {
      const response = await fetch(`${endPoint}/api/Customers/${customerId}`);
      if (!response.ok) throw new Error(`Network response not ok, status: ${response.status}`);
      const customerData = await response.json();
      setCustomerPic(`${endPoint}/storage/profile_images/${customerData.image}`);
    } catch (error) {
      console.error('Error fetching customer picture:', error.message);
    }
  };

  // Fetch transactions and total credit
  const fetchData = async () => {
    try {
      const transactionsResponse = await fetch(`${endPoint}/api/Transactions/${customerId}`);
      if (!transactionsResponse.ok) throw new Error('Network response was not ok');
      const transactionsData = await transactionsResponse.json();

      if (!Array.isArray(transactionsData.transactions)) {
        throw new Error('Transactions data is not an array');
      }

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

      const formattedTransactions = Object.keys(groupedTransactions).reverse().map(date => ({
        title: date,
        data: groupedTransactions[date],
      }));

      setCustomerTransactions(formattedTransactions.length > 0 ? formattedTransactions : []);

      const totalResponse = await fetch(`${endPoint}/api/TotalTrans/${customerId}`);
      if (!totalResponse.ok) throw new Error('Network response was not ok');
      const totalData = await totalResponse.json();

      setTotal(totalData.totalTrans ?? 0);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setCustomerTransactions([]);
      setTotal(0);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await GetCustomerPic();
    setRefreshing(false);
  };

  // Handle image upload
  const updateCustomerImage = async (imageUri) => {
    if (!imageUri) {
      console.error('No image URI provided');
      return;
    }

    const formData = new FormData();
    const imageType = imageUri.substring(imageUri.lastIndexOf(".") + 1);
    const imageName = `photo.${imageType}`;

    formData.append('image', {
      uri: imageUri,
      type: `image/${imageType}`,
      name: imageName,
    });

    try {
      const response = await axios.put(`${endPoint}/api/Customers/${customerId}/update-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      console.log('Image uploaded successfully', response.data);
      if (response.data.image) {
        const uploadedImageUri = `${endPoint}/storage/profile_images/${response.data.image}`;
        setCustomerPic(uploadedImageUri); // Update CustomerPic state
        console.log('Updated image URI:', uploadedImageUri);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImageUri(selectedImage.uri);
      updateCustomerImage(selectedImage.uri); // Upload the selected image
    }
  };

  // Handle long press on avatar
  const handleLongPress = () => {
    pickImage();
  };

  // Handle input change
  const handleInputChange = (text, fieldName) => {
    setState((prevState) => ({ ...prevState, [fieldName]: text }));
  };

  // Update customer profile
  const UpdateCustomerProfile = async () => {
    if (!state.currentPassword) {
      Alert.alert('Error', 'Current password is required to update your profile.');
      return;
    }

    const updatedCustomerData = {
      email: state.email,
      currentPassword: state.currentPassword,
      newPassword: state.newPassword,
    };

    try {
      const response = await fetch(`${endPoint}/api/Customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedCustomerData),
      });

      if (!response.ok) {
        console.error('Error: ', response.status, response.statusText);
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const updatedDataResponse = await response.json();
      Alert.alert('Success', 'Profile updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating customer data:', error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const initials = name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
  };

  // Render transaction item
  const renderItem = ({ item }) => (
    <SafeAreaView>
      <TouchableOpacity style={styles.item} activeOpacity={0.6}>
        <View style={styles.keyQte}>
          <Text style={styles.key}>{item.produit_bought}</Text>
          <Text style={[styles.Qte, { color: colorPicked }]}>
            {item.Quantity_bought} x {item.produit_price} {dictionary[CurrentLanguage]?.unit_price}
          </Text>
        </View>
        <Text style={[styles.value, { backgroundColor: colorPicked }]}>
          {item.produit_price * item.Quantity_bought} {dictionary[CurrentLanguage]?.mad}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Render section header
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.dateHeader}>{formatDate(title)}</Text>
  );

  // Open/close edit modal
  const openEditModal = () => setModalVisible(true);
  const closeEditModal = () => setModalVisible(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    GetCustomerPic();
  }, []);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onLongPress={handleLongPress} delayLongPress={400}>
          <View style={[styles.avatar, { backgroundColor: colorPicked }]}>
            {CustomerPic ? (
              <Image source={{ uri: CustomerPic }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <Text style={styles.avatarText}>{getInitials(customerName)}</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.nameSection}>
          <Text style={styles.title}>{customerName}</Text>
          <TouchableOpacity onPress={openEditModal}>
            <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colorPicked} />
        ) : customerTransactions.length > 0 ? (
          <SectionList
            sections={customerTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <Text style={styles.noTransactionsText}>No transactions found.</Text>
        )}
        <View style={styles.CustomerDetailsFooter}>
          <View style={styles.additionalInfo}>
            <Text style={styles.TotalCredit}>
              {dictionary[CurrentLanguage]?.total_credit} :
              {total ? total.find(item => item.Total)?.Total || '0.00' : 'Loading...'}
              {dictionary[CurrentLanguage]?.mad}
            </Text>
          </View>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={closeEditModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={state.email}
              onChangeText={(text) => handleInputChange(text, 'email')}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              value={state.currentPassword}
              onChangeText={(text) => handleInputChange(text, 'currentPassword')}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={state.newPassword}
              onChangeText={(text) => handleInputChange(text, 'newPassword')}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={UpdateCustomerProfile}>
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  dateHeader: {
    fontSize: 13,
    margin: 5,
    color: '#222',
  },
  item: {
    backgroundColor: '#fff',
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  value: {
    minWidth: 100,
    borderRadius: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#fff',
  },
  keyQte: {
    flex: 1,
    marginRight: 16,
  },
  key: {
    fontWeight: 'bold',
  },
  Qte: {
    fontSize: 12,
  },
  CustomerDetailsFooter: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TotalCredit: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default MainScreen;