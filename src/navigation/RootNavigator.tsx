
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { RootStackParamList } from './types';
import ProtectedRoutes from '../components/routes/ProtectedRoutes';
import PublicRoutes from '../components/routes/PublicRoutes';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const isAuthenticated = useAuthStore((state)=> state.isAuthenticated);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
            <RootStack.Screen name="ProtectedRoutes" component={ProtectedRoutes} />
        ) : (
            <RootStack.Screen name="PublicRoutes" component={PublicRoutes} />
        )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
