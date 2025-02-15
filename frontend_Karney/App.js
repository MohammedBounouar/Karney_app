import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';



// Import local files
import Home from './Screens/StoreOwner_Side/Home';
import Account from './Screens/StoreOwner_Side/Account';
import Login from './Screens/StoreOwner_Side/Login';
import LoadingScreen from './Screens/StoreOwner_Side/LoadingScreen';
import CreateNewAccount from './Screens/StoreOwner_Side/CreateNewAccount';
import CustomerDetails from './Screens/StoreOwner_Side/CustomerDetails';
import Chat from './Screens/StoreOwner_Side/Chat';
import Discussion from './Screens/StoreOwner_Side/Discussion';
import Plans from './Screens/StoreOwner_Side/Plans';
import { CustomTabBar } from './Screens/StoreOwner_Side/CustomTabBar';
import PaymentScreen from './Screens/StoreOwner_Side/PaymentScreen';

import CustomerLogin from './Screens/Customer_Side/CustomerLogin';
import MainScreen from './Screens/Customer_Side/MainScreen';

// Icons {https://icons.expo.fyi/}
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


// Initialize navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />} // Use your custom tab bar
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Entypo name={iconName} size={size} color={color} />;
          } else if (route.name === 'Chat') {
            iconName = 'notifications';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Account') {
            iconName = 'manage-accounts';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }
        },
        headerShown: false, // Hide the header
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('language');
        if (value === null) {  // Check if no language is set
          await AsyncStorage.setItem('language', 'ar');
          console.log('Default language set to "ar"');
        }
        setIsFirstLaunch(false);
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create new account" component={CreateNewAccount} />
        <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="Discussion" component={Discussion} />
        <Stack.Screen name="Plans" component={Plans} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        {/* Customer Side */}
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
