import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Alerts = ({messageAlert}) => {
  return (
    <>
      <View
        style={[styles.alertContainer, { justifyContent: 'center', alignSelf: 'center' }]}
      >
        <Text style={styles.alertText}>{messageAlert}</Text>
      </View>
    </>
  )
}

export default Alerts

const styles = StyleSheet.create({
  alertContainer: {
    padding: 20,
    width: '70%',
    backgroundColor: '#888888', // Replace "#red" with a valid color code
    borderRadius: 30,
    margin: 20,
  },
  alertText: {
    textAlign: 'center',
    color: '#fff', // Make the text white for better visibility on a red background
  },
});
