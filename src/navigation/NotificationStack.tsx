import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeParamList } from '../utils/types';
import Home from '../components/screens/Home';
import Notification from '../components/screens/Notification';

type Props = {}

const Stack = createNativeStackNavigator<HomeParamList>();

const HomeStack = ({}: Props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Notification" component={Notification} options={{ title: 'Notifications' }}/>
    </Stack.Navigator>
  );
};

export default HomeStack;

