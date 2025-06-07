// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
// import { RootStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import ProtectedRoutes from '../navigation/ProtectedRoutes';
import PublicRoutes from '../navigation/PublicRoutes';
import Onboarding from './Onboarding';
import Splash from '../components/screens/Splash/Splash';
// import useFirstLaunch from '../hooks/useFirstLaunch';
import React, { useEffect } from 'react';
import { useFirebaseAuthListener } from '../hooks/useFirebaseAuthListener';
// import auth from '@react-native-firebase/auth';

// const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    // const isAuthenticated = useAuthStore((state)=> state.isAuthenticated);
    // const initializing = useAuthStore((state) => state.initializing);
    // const isFirstLaunch = useFirstLaunch();
    // const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
    // const setInitializing = useAuthStore((s) => s.setInitializing);

    // useEffect(() => {
    //     const unsubscribe = auth().onAuthStateChanged((user) => {
    //         setAuthenticated(!!user);
    //         setInitializing(false);
    //     });

    //     return unsubscribe;
    // }, [setAuthenticated, setInitializing]);

    // if (initializing || isFirstLaunch === null) {
    //     return <Splash />;
    // }

    const {isLoading, isOnboarded, isAuthenticated, initApp} = useAppStore();

    useEffect(() => {
        initApp(); // This loads the state from asyncStorage
    }, [initApp]);

    useFirebaseAuthListener(); // This listens to auth state changes

    if (isLoading){
        return <Splash />;
    }

    return (
        // <RootStack.Navigator
        //     screenOptions={{headerShown: false}}
        //     initialRouteName={isFirstLaunch ? 'Onboarding' : 'ProtectedRoutes'}
        // >
        //     {/* <RootStack.Screen name="Onboarding" component={Onboarding} /> */}
        //     <RootStack.Screen name="ProtectedRoutes" component={ProtectedRoutes} />
        //     <RootStack.Screen name="PublicRoutes" component={PublicRoutes} />
        // </RootStack.Navigator>

        <NavigationContainer>
            {!isOnboarded ? (
                <Onboarding />
            ) : isAuthenticated ? (
                <ProtectedRoutes />
            ) : (
                <PublicRoutes />
            )}
        </NavigationContainer>

    );
};

export default RootNavigator;
