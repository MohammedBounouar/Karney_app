import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dictionary from './language.json';
import useLanguage from './Translate';
import ColorPicker from './ColorPicker';
import SpinnerLoad from './Spinner';
import { endPoint } from '../../endpoint';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width } = Dimensions.get('window');

const colorMap = {
    "#050C9C": ["#FFFFFF", "#686D76", "#050C9C"],
    "#0E8388": ["#FFFFFF", "#295F98", "#0E8388"],
    "#607274": ["#FFFFFF", "#393E46", "#607274"],
    "#D65A31": ["#FFFFFF", "#CD5C08", "#D65A31"],
};

const Plans = ({ navigation }) => {
    const colorPicked = ColorPicker();
    const CurrentLanguage = useLanguage();
    const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
    const [plans, setPlans] = useState([]);
    const [OwnerPlan, setOwnerPlan] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const handleSelectPlan = (plan) => {
        setSelectedPlanDetails(plan);
    };

    const GetPlans = async () => {
        try {
            const response = await fetch(`${endPoint}/api/Plans`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPlans(data.plans || []);
        } catch (error) {
            setError('Error fetching plans. Please try again later.');
        }
    };

    const GetOwnerPlan = async () => {
        try {
            const storeOwnerId = await AsyncStorage.getItem('Id');
            if (!storeOwnerId) {
                throw new Error('Store owner ID not found');
            }
            const response = await fetch(`${endPoint}/api/store-owner/plan/${storeOwnerId}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            if (data && data.plan) {
                setOwnerPlan(data.plan);
            } else {
                setError('No plan found for the store owner.');
            }
        } catch (error) {
            setError('Error fetching owner plan. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            await Promise.all([GetPlans(), GetOwnerPlan()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const getBackgroundColor = (index) => {
        const colors = colorMap[colorPicked] || ["#FFFFFF", "#686D76", "#050C9C"];
        return colors[index] || colors[0];
    };

    const renderPlan = (plan, index) => (
        <TouchableOpacity
            key={plan.name}
            style={[
                styles.Plan,
                { backgroundColor: getBackgroundColor(index) },
                selectedPlanDetails && selectedPlanDetails.name === plan.name && styles.selectedPlan
            ]}
            activeOpacity={0.9}
            onPress={() => handleSelectPlan(plan)}
            accessibilityLabel={`Select ${plan.name} plan`}
        >
            <View>
                <Text style={[styles.planTitle, { color: index === 0 ? colorPicked : 'white' }]}> {plan.name} Plan </Text>
                <Text style={[styles.planDescription, { color: index === 0 ? 'black' : 'white' }]}> +{plan.customers_limit} customers to your store{"\n"} - {plan.name} Support </Text>
            </View>
            {OwnerPlan && OwnerPlan.name === plan.name && (
                <AntDesign
                    name="checkcircle"
                    size={24}
                    color={plan.name === 'Free' ? colorPicked : 'white'}
                />
            )}
        </TouchableOpacity>
    );

    // Determine which plan/budget to show: selected or current
    const displayPlan = selectedPlanDetails || OwnerPlan;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.Back}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back-sharp" size={24} color="#393E46" />
                    <Text style={styles.title}>Choose Your Plan</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.PlansContainer}>
                {loading ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <SpinnerLoad />
                    </View>
                ) : error ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
                    </View>
                ) : plans.length > 0 ? (
                    <View style={styles.PlanBudgetContainer}>
                        <View>
                            <Text style={styles.PlanTitle}>Current Plan :</Text>
                            <Text style={[styles.PlanText, { color: colorPicked }]}> {displayPlan?.name || 'None'} </Text>
                        </View>
                        <View style={styles.Devider}></View>
                        <View>
                            <Text style={styles.PlanTitle}>Budget :</Text>
                            <Text style={[styles.PlanText, { color: colorPicked }]}> {displayPlan?.price || '0'} MAD </Text>
                        </View>
                    </View>
                ) : null}
                {plans.map((plan, index) => renderPlan(plan, index))}
            </View>
            {selectedPlanDetails && selectedPlanDetails.name !== 'Free' && (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colorPicked }]}
                    onPress={() => navigation.navigate('PaymentScreen', { plan: selectedPlanDetails?.name, budget: selectedPlanDetails?.price })}
                    accessibilityLabel="Select the plan and proceed to payment"
                >
                    <View>
                        <Text style={styles.buttonText}>Select the Plan</Text>
                    </View>
                </TouchableOpacity>
            )}
            <View></View>
        </View>
    );
};

const styles = StyleSheet.create({
  bottomBanner: {
    position: "absolute",
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Back:{
    flexDirection : "row",
    justifyContent : "flex-start",
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 57,
    marginBottom : 10,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textAlign : "center",
  },
  PlansContainer: {
    width: width,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginTop : 5,
  },
  PlanBudgetContainer: {
    position : "relative",
    top : -30 ,
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  PlanTitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "300",
  },
  PlanText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  Devider: {
    width: 1, // Thickness of the vertical line
    height: '80%', // Adjust this based on how long you want the line to be
    backgroundColor: '#ccc', // Line color
    marginHorizontal: 30, // Space between the sections
  },
  Plan: {
    width: '90%', // Plan container width
    height : '27%',
    padding: 20,
    marginVertical: 10, // Space between the plans
    marginBottom: -35, // Make plans overlap by reducing the bottom margin
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    zIndex: 1, // Ensure that each plan is drawn above the one below
},
  planTitle: {
    textAlign :'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  selectedPlan: {
    borderColor : '#ddd',
    borderWidth : 2,
    position: 'relative',
    zIndex: 2, // Higher zIndex to appear on top
    top: -10, // Adjust as needed to make it stand out
    elevation: 5, // For Android shadow effect
  },
  button: {
    justifyContent : "center",
    alignSelf : "center",
    alignItems: 'center',
    backgroundColor: '#3559E0', // Use your preferred color here
    margin : 7 ,
    padding: 18,
    borderRadius: 25,
    width: '70%',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  adsButton : {
    width : '50%',
    flexDirection : 'row',
    justifyContent : 'space-between',
    marginTop: 57,
    marginBottom : 10,
    marginLeft : 15,
  }
});

export default Plans;

