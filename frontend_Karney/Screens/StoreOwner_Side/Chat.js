import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import { endPoint } from '../../endpoint';


const Avatar = ({ bgColor, size, borderRadius, children, style }) => {
  return (
    <View style={[styles.avatar, { backgroundColor: bgColor, borderRadius: borderRadius }, style]}>
      <Text style={styles.avatarText}>{children}</Text>
    </View>
  );
};

const Chat = ({ navigation }) => {
  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [conversations, setConversations] = useState(null);

  const handleCustomerPress = (customer) => {
    setSelectedCustomer(customer);
    navigation.navigate('Discussion', { customer });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeOwnerId = await AsyncStorage.getItem('Id');
        const response = await fetch(`${endPoint}/api/myCustomers/${storeOwnerId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setConversations(data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor="#EEEEEE"
      onPress={() => handleCustomerPress(item)}
    >
      <View style={styles.customerItem}>
        <Avatar bgColor={colorPicked} size="sm" borderRadius={25} style={styles.avatarMargin}>
          {item.full_name[0]} {/* Display the first letter of the name */}
        </Avatar>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.full_name}</Text>
          <Text style={styles.customerLastMessage}>Last message snippet...</Text>
        </View>
        <View style={styles.messageTimeContainer}>
          <Text style={styles.messageTime}>3:45 PM</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  return (
    <>
      <LinearGradient
        colors={[
          colorPicked === "#D80032" ? "#FF0033" :
          colorPicked === "#3559E0" ? "#6F83F3" :
          colorPicked === "#0D9276" ? "#4DBBA1" :
          colorPicked === "#6D9886" ? "#A3C1B1" :
          "#FFFFFF", colorPicked
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <TouchableOpacity style={styles.nav} onPress={() => navigation.navigate('MainApp')}>
          <Ionicons name="chevron-back-sharp" size={22} color="#ffffff" style={{ marginTop: 15 }} />
        </TouchableOpacity>
        <Text style={styles.chatTitle}>{dictionary[CurrentLanguage]?.Customer_alert}</Text>
      </LinearGradient>
      <View style={styles.listContainer}>
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop : 15,
  },
  listContainer: {
    marginTop: 40,
    paddingHorizontal: 15,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 19,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  avatarMargin: {
    marginRight: 15,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  customerLastMessage: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  messageTimeContainer: {
    justifyContent: 'center',
  },
  messageTime: {
    fontSize: 12,
    color: '#999999',
  },
});

export default Chat;
