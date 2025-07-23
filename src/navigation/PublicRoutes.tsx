
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Onboarding from './Onboarding';
import ForgotPassword from '../components/auth/ForgotPassword';


const Stack = createNativeStackNavigator();

const PublicRoutes = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={Onboarding}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Register" component={Register}/>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
  </Stack.Navigator>
  );
};

export default PublicRoutes;

