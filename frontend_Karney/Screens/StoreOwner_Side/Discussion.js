import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import { endPoint } from '../../endpoint';



const Discussion = ({ route, navigation }) => {
  const CurrentLanguage = useLanguage();
  const ColorPicked = ColorPicker();

  
  
  const [messages, setMessages] = useState([]);
  
  // useEffect(() => {
  //   //the id of current customer in chat , its a parametre from Chat.js
  //   const customerID = route.params.customer.id;
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await fetch(`${endPoint}/api/chat/${customerID}`);
  //       const data = await response.json();
  //       setMessages(data.messages);
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
  //   };
  
  //   fetchMessages();
  
  // }, [route.params.customer.id]);
  
  const renderItem = ({ item }) => {
    return (
      <View style={styles.MessageAlert}>
        <Text>{item.message_text}</Text>
      </View>
    );
  };
  
  return (
    <>
      <ImageBackground
        source={require('../../assets/pattern.jpg')}
        style={styles.background}
        imageStyle={{ opacity: 0.1 }}
      >
        <TouchableOpacity style={styles.nav} onPress={() => navigation.navigate('MainApp')}>
          <Ionicons name="chevron-back-sharp" size={24} color="#393E46" />
        </TouchableOpacity>
        <Text style={styles.DiscussionTitle}>{route.params.customer.full_name}</Text>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
          <TouchableOpacity style={{flex :1 , justifyContent : 'center' , alignItems : 'center'}} onPress={() => navigation.navigate('MainApp')}>
        <View style={[styles.AlertButton , {backgroundColor : ColorPicked}]}>
              <AntDesign name="notification" size={24} color="white" />
        </View>
          </TouchableOpacity>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput style={styles.input} placeholder={dictionary[CurrentLanguage]?.write_message} />
          <TouchableOpacity style={{ display: 'flex', marginLeft: 5 }}>
            <Feather name="send" size={30} color={ColorPicked} />
          </TouchableOpacity>
        </View> */}
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    marginTop: 60,
    marginLeft: 9,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    zIndex: 0,
  },
  input: {
    flex: 1,
    maxWidth: 330,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.6,
    borderColor: '#25252555',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 40,
    marginBottom: 8,
    marginLeft: 5,
  },
  DiscussionTitle: {
    fontSize: 15,
    fontWeight: 'normal',
    marginTop: -25,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  MessageAlert: {
    fontSize: 19,
    padding : 15,
    margin : 8,
    borderRadius : 30,
    backgroundColor : '#F2E7D5',
  },
  AlertButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 9999,
    width: 60, 
    height: 60, 
  },
  
});

export default Discussion;
