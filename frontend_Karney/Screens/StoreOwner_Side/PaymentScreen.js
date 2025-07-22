import React, { useState } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

export default function PaymentScreen({ route, navigation }) {
  const { plan, budget } = route.params;
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment } = useStripe();

  const fetchPaymentIntentClientSecret = async () => {
    // Replace with your backend endpoint
    const response = await fetch(`${endPoint}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: budget * 100, // Stripe expects amount in cents
        currency: 'mad', // or 'usd', etc.
      }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const handlePayPress = async () => {
    // 1. Get client secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret();

    // 2. Confirm payment
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          // Add billing details if needed
        },
      },
    });

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else if (paymentIntent) {
      Alert.alert('Payment successful', `PaymentIntent status: ${paymentIntent.status}`);
      // Optionally navigate or update UI
    }
  };

  return (
    <View style={{ margin: 50 }}>
      <Text>You selected the {plan} plan with a budget of {budget} MAD</Text>
      <CardField
        postalCodeEnabled={false}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{ backgroundColor: '#FFFFFF', textColor: '#000000' }}
        style={{ width: '100%', height: 50, marginVertical: 30 }}
        onCardChange={cardDetails => setCardDetails(cardDetails)}
      />
      <Button title="Pay" onPress={handlePayPress} />
    </View>
  );
}

