import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../components/screens/Home';
import Profile from '../components/screens/Profile';
import Category from '../components/screens/Category';
import { StyleSheet } from 'react-native';
import Test from '../components/screens/Test';
import New from '../components/screens/New';


const Tab = createBottomTabNavigator();

const getTabBarIcon = (route: { name: string }) => ({ color, size }: { color: string; size: number }) => {
    let iconName: string = '';
    let IconComponent: typeof Icons | typeof FontAwesome6 | typeof Ionicons = Icons;


    // Choose the icon and library based on the route name
    if (route.name === 'Home') {
      IconComponent = Icons;
      iconName = 'home-filled';
    } else if (route.name === 'Category' || route.name === 'Test') {
      IconComponent = Ionicons;
      iconName = 'newspaper'; // Material Icons
    } else if (route.name === 'Cart') {
      IconComponent = Icons;
      iconName = 'shopping-cart';
    } else if (route.name === 'Profile') {
      IconComponent = Ionicons;
      iconName = 'person'; // Material Icons
    }
    // Return the chosen icon component
    return <IconComponent name={iconName} size={size} color={color} />;
};

const ProtectedRoutes = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon(route),
        tabBarActiveTintColor: '#54408C',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: styles.tabarStyle,
      })}>
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="Category" component={Category}/>
        <Tab.Screen name="Test" component={Test}/>
        <Tab.Screen name="New" component={New}/>
        <Tab.Screen name="Profile" component={Profile}/>
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabarStyle: {
    position: 'absolute',
    bottom: 25,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 5,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderColor:'#e0e0e0',
    borderWidth: 1,
    marginHorizontal: 20,
    width: '90%',
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    paddingBottom: 5,
    paddingTop: 5,
  },
});
export default ProtectedRoutes;
