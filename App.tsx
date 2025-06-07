/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@react-native-firebase/app';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';

const queryCLient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryCLient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
        <Toast/>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
