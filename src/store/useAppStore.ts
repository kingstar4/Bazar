
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Book } from '../utils/types';

type User = {
  uid: string;
  name: string;
  phone: string;
  email: string;
  profilePicture?: string;
}

type AppState = {
  isLoading: boolean;
  isOnboarded: boolean;
  isAuthenticated: boolean;
  search: string;
  user: User| null;
  isFavourite: boolean;
  favourites: Book[];
  initApp: () => Promise<void>;
  setOnboarded: () => Promise<void>;
  login: (token: string, uid:string) => Promise<void>;
  setUser: (user: User) => void;
  // updateUserProfilePicture: (profilePicture: string) => Promise<void>;
  logout: () => Promise<void>;
  setSearch: (search: string)=> void;


  // Favourites
  addFavourite: (book: Book) => void;
  removeFavourite: (bookId: string) => void;
  isBookFavourite: (bookId: string) => boolean;

  // Biometric Authentication
  isBiometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  isOnboarded: false,
  isAuthenticated: false,
  search: '',
  user: null,
  isFavourite: false,
  favourites: [],
  isBiometricEnabled: false,


  // Run once when app launches
  initApp: async () => {
    const startTime = Date.now();
    const minSplashDuration = 3000; // 3 seconds minimum

    try {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      const token = await AsyncStorage.getItem('authToken');
      const userJSON = await AsyncStorage.getItem('userInfo');
      const biometrics = await AsyncStorage.getItem('isBiometricEnabled');
      const favs = await AsyncStorage.getItem('favourites');


      // Calculate remaining time to ensure minimum splash duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minSplashDuration - elapsedTime);

      // Wait for remaining time if needed
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      set({
        isOnboarded: !!onboarded,
        isAuthenticated: !!token,
        user: userJSON ? JSON.parse(userJSON) : null,
        isBiometricEnabled: biometrics === 'true',
        favourites: favs ? JSON.parse(favs) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during app init', error);

      // Even on error, ensure minimum splash duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minSplashDuration - elapsedTime);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      set({ isLoading: false });
    }
  },

  // Called after user completes onboarding screen
  setOnboarded: async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    set({ isOnboarded: true });
  },

  // For search requests
  setSearch: (value) => set({search: value}),


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
        profilePicture: userData.profilePicture,
      };

      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      console.log('UserInfo: ',user);
      set({ user });
    } else {
      // Firestore user not found or permission denied
      set({ user: null });
      throw new Error('Failed to fetch user profile from Firestore. Please check your permissions and user document.');
    }
    console.log('login called with UID:', uid);
    console.log(' Firestore userData:', userData);
  },

  // Called when user logs out
  logout: async () => {
    try {
      // Check if there's a current user before signing out
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
        console.log('Firebase user signed out');
      } else {
        console.log('No Firebase user to sign out');
      }

      // Clear local storage
      // await AsyncStorage.removeItem('authToken');
      // await AsyncStorage.removeItem('userInfo');

      // Update state
      set({
        isAuthenticated: false,
        user: null,
      });

      console.log('User successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);

      // Even if Firebase signout fails, clear local data
      // await AsyncStorage.removeItem('authToken');
      // await AsyncStorage.removeItem('userInfo');
      set({
        isAuthenticated: false,
        user: null,
      });
    }
  },

  setBiometricEnabled: async (enabled) => {
    await AsyncStorage.setItem('isBiometricEnabled', JSON.stringify(enabled));
    set({ isBiometricEnabled: enabled });
  },

  setUser: (user) => {
    AsyncStorage.setItem('userInfo', JSON.stringify(user));
    set({ user });
  },

  addFavourite: (book) => {
    const { favourites } = get();
    const exists = favourites.some(b => b.id === book.id);
    if (!exists) {
      const updated = [...favourites, { ...book, isFavourite: true }];
      AsyncStorage.setItem('favourites', JSON.stringify(updated));
      set({ favourites: updated });
    }
  },

  removeFavourite: (bookId) => {
    const { favourites } = get();
    const updated = favourites.filter(b => b.id !== bookId);
    AsyncStorage.setItem('favourites', JSON.stringify(updated));
    set({ favourites: updated });
  },

  isBookFavourite: (bookId) => {
    const { favourites } = get();
    return favourites.some(b => b.id === bookId);
  },

}));
