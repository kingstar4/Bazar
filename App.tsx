/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import '@react-native-firebase/app';
import RootNavigator from './src/navigation/RootNavigator';
import Onboarding from './src/components/screens/Onboarding';
import { useAuthStore } from './src/store/useAuthStore';
import useFirstLaunch from './src/hooks/useFirstLaunch';
import Toast from 'react-native-toast-message';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import Splash from './src/components/screens/SplashScreen/Splash';


const Stack = createNativeStackNavigator();
const queryCLient = new QueryClient();

const App = () => {
  const isFirstLaunch = useFirstLaunch();

  console.log('First Launch:', isFirstLaunch);

  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setInitializing = useAuthStore((s) => s.setInitializing);
  const initializing = useAuthStore((s) => s.initializing);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setAuthenticated(!!user);
      setInitializing(false);
    });

    return unsubscribe;
  }, [setAuthenticated, setInitializing]);

  if (initializing || isFirstLaunch === null) {
    return <Splash/>;
  } // Or show splash screen

  return (
    <QueryClientProvider client={queryCLient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isFirstLaunch ? (
              <Stack.Screen name="Onboarding" component={Onboarding} />
            ) : (
              <Stack.Screen name="RootNavigator" component={RootNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast/>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
