// src/store/useAppStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Book } from '../utils/types';

type User = {
  uid: string;
  name: string;
  phone: string;
  email: string;
}

type AppState = {
  isLoading: boolean;
  isOnboarded: boolean;
  isAuthenticated: boolean;
  user: User| null;
  initApp: () => Promise<void>;
  setOnboarded: () => Promise<void>;
  login: (token: string, uid:string) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;

  // For Opening the bottom sheet
  isModalVisible: boolean;
  selectedBook: Book | null;
  setIsModalVisible: (visible:boolean)=>void
  setSelectedBook: (book: Book | null)=> void
  reset: ()=> void
};

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  isOnboarded: false,
  isAuthenticated: false,
  user: null,
  isModalVisible:false,
  selectedBook: null,

  // Run once when app launches
  initApp: async () => {
    try {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      const token = await AsyncStorage.getItem('authToken');
      const userJSON = await AsyncStorage.getItem('userInfo');

      set({
        isOnboarded: !!onboarded,
        isAuthenticated: !!token,
        user: userJSON ? JSON.parse(userJSON) : null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during app init', error);
      set({ isLoading: false });
    }
  },

  // Called after user completes onboarding screen
  setOnboarded: async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    set({ isOnboarded: true });
  },

  // Called after successful login (with Firebase token)
  login: async (token, uid) => {
    await AsyncStorage.setItem('authToken', token);
    set({ isAuthenticated: true });

    // Fetch Firestore user profile
    const userDoc = await firestore().collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (userData) {
      const user = {
        uid,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
      };

      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      console.log('UserInfo: ',user);
      set({ user });
    }
    console.log('✅ login called with UID:', uid);
    console.log('👤 Firestore userData:', userData);
  },

  // Called when user logs out
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    set({ isAuthenticated: false });
  },

  setUser: (user) => {
    AsyncStorage.setItem('userInfo', JSON.stringify(user));
    set({ user });
  },

  setIsModalVisible: (visible)=> set({isModalVisible: visible}),
  setSelectedBook: (book)=> set({selectedBook: book}),

  reset: ()=> set({isModalVisible: false, selectedBook: null}),

}));
