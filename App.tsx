/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@react-native-firebase/app';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';


GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});


const queryCLient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryCLient}>
      <GestureHandlerRootView style={{ flex: 1}}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'fff'}}>
          <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
          <RootNavigator />
          <Toast/>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
