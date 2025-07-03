/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import ProfileCardUI from '../../customUI/ProfileCardUI';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProfileParamList } from '../../../utils/types';
import BiometricToggle from '../../customUI/BiometricToggle';
import { avatarOptions } from '../../data/avatar';
import firestore from '@react-native-firebase/firestore';
import { FlashList } from '@shopify/flash-list';

const Profile = () => {
  const { width } = Dimensions.get('window');
  const { logout, user, setUser } = useAppStore();
  const favouriteCount = useAppStore((state) => state.favourites.length);
  const navigation = useNavigation<NavigationProp<ProfileParamList>>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('Zustand user:', user);
  }, [user]);

  const handleSelectAvatar = async (avatarName: string) => {
    if (!user) {return;}
    await firestore().collection('users').doc(user.uid).update({
      profilePicture: avatarName,
    });
    const updatedUser = { ...user, profilePicture: avatarName };
    setUser(updatedUser);
    setModalVisible(false);
  };

  const handleResetAvatar = async () => {
    if (!user) {return;}
    await firestore().collection('users').doc(user.uid).update({
      profilePicture: '',
    });
    const updatedUser = { ...user, profilePicture: '' };
    setUser(updatedUser);
    setModalVisible(false);
  };

  const selectedAvatar = avatarOptions.find(a => a.name === user?.profilePicture);

  return (
    <View style={styles.container}>
      <View style={{ width, height: 100, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign:'center' }}>Profile</Text>
      </View>
      <View style={styles.profileSection}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
            <Image
              source={selectedAvatar?.source || require('../../../../assets/img/avatar1.png')}
              style={styles.avatar}
            />
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Change Photo</Text>
          </TouchableOpacity>

          {user ? (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 20 }}>
              <Text style={styles.email}>{user.name}</Text>
              <Text style={{letterSpacing:1, fontWeight:'500'}}>{user.phone}</Text>
            </View>
          ) : <ActivityIndicator size="large" color="#54408C" style={{alignSelf:'center', marginVertical:16}} />}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        <ProfileCardUI text="My Account" iconName="person" />
        <ProfileCardUI text="Favourite" onPress={() => navigation.navigate('FavouriteList')} itemNumber={favouriteCount > 0 ? `${favouriteCount}` : ''} iconName="heart" />
        <BiometricToggle />
        <ProfileCardUI text="Help Center" iconName="chatbubble-ellipses" />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Avatar</Text>

            <FlashList
              data={avatarOptions}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={10}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity key={item.name} onPress={() => handleSelectAvatar(item.name)} style={styles.avatarWrapper}>
                    <Image
                      source={item.source}
                      style={[
                        styles.modalAvatar,
                        user?.profilePicture === item.name && { borderColor: '#54408C', borderWidth: 2 },
                      ]}
                    />
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity onPress={handleResetAvatar}>
              <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>Reset to Default</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  avatarContainer: {
    marginVertical: 10,
    alignItems: 'center',

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  avatarWrapper: {
    marginHorizontal: 8,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    backgroundColor: '#54408C',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
