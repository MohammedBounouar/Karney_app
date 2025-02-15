import React from 'react'
import { Text, View } from 'react-native';

export default function PaymentScreen({ route, navigation }) {
    const { plan, budget } = route.params; // Destructure the parameters
  return (
    <View style={{margin : 50}}>
        <Text>You selected the {plan} plan with a budget of {budget} MAD</Text>
    </View>
  )
}

