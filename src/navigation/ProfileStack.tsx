import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavouriteList from '../components/screens/Profile/FavouriteList';
import { ProfileParamList } from '../utils/types';
import Profile from '../components/screens/Profile';


const Stack = createNativeStackNavigator<ProfileParamList>();

export default function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavouriteList"
        component={FavouriteList}
        options={{ title: 'Favourites'}}
      />
    </Stack.Navigator>
  );
};