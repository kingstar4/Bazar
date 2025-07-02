/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppStore } from '../../../store/useAppStore';
import ProfileCardUI from '../../customUI/ProfileCardUI';
// import { ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProfileParamList } from '../../../utils/types';
import BiometricToggle from '../../customUI/BiometricToggle';

const Profile = () => {
  const { width } = Dimensions.get('window');
  const [avatar, setAvatar] = useState<string | null>(null);
  const { logout } = useAppStore();
  const user = useAppStore((state)=> state.user);
  const favouriteCount = useAppStore((state) => state.favourites.length);
  const navigation = useNavigation<NavigationProp<ProfileParamList>>();

  useEffect(() => {
  console.log(' Zustand user:', user);
}, [user]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets && result.assets[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  // const truncateEmail = (email: string) => {
  //   return email.length > 25 ? `${email.substring(0, 22)}...` : email;
  // };

  return (
    <View style={styles.container}>
      <View style={{ width, height: 100, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign:'center' }}>Profile</Text>
      </View>
      <View style={styles.profileSection}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text>Add Photo</Text>
              </View>
            )}
            </TouchableOpacity>

          {user ?
            (<View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 20 }}>
            <Text style={styles.email}>
              {user.name}
            </Text>
            <Text style={{letterSpacing:1, fontWeight:500}}>{user.phone}</Text>
          </View>)
          : <ActivityIndicator size="large" color="#54408C" style={{alignSelf:'center', marginVertical:16}}/>
        }
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        <ProfileCardUI text="My Account" iconName="person"/>
        <ProfileCardUI text="Favourite" onPress={()=> navigation.navigate('FavouriteList')} itemNumber={favouriteCount > 0 ? `${favouriteCount}` : ''} iconName="heart"/>
        <BiometricToggle/>
        <ProfileCardUI text="Help Center" iconName="chatbubble-ellipses"/>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  profileSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    // marginTop: 20,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  avatarContainer: {
    marginVertical: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});