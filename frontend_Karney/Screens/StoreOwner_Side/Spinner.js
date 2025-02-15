import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

import ColorPicker from './ColorPicker';
import dictionary from './language.json';
import useLanguage from './Translate';

function SpinnerLoad() {
  
  // Change color
  const colorPicked = ColorPicker();
  // Change language
  const CurrentLanguage = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={colorPicked} />
        <Text style={styles.text}>{dictionary[CurrentLanguage]?.please_wait}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  spinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default SpinnerLoad;
