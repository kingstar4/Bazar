
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Onboarding from './Onboarding';


const Stack = createNativeStackNavigator();

const PublicRoutes = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={Onboarding}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Register" component={Register}/>
      {/* <Stack.Screen name="EmailVerification" component={EmailVerification}/>
      <Stack.Screen name="Phone" component={Phone}/>
      <Stack.Screen name="PhoneVerification" component={PhoneVerification}/>
      <Stack.Screen name="Congrats" component={Congrats}/>
      <Stack.Screen name="ProtectedRoute" component={ProtectedRoute}/> */}
  </Stack.Navigator>
  );
};

export default PublicRoutes;

