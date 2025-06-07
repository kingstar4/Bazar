// src/store/useAppStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppState = {
  isLoading: boolean;
  isOnboarded: boolean;
  isAuthenticated: boolean;
  initApp: () => Promise<void>;
  setOnboarded: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  isOnboarded: false,
  isAuthenticated: false,

  // Run once when app launches
  initApp: async () => {
    try {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      const token = await AsyncStorage.getItem('authToken');

      set({
        isOnboarded: !!onboarded,
        isAuthenticated: !!token,
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
  login: async (token) => {
    await AsyncStorage.setItem('authToken', token);
    set({ isAuthenticated: true });
  },

  // Called when user logs out
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    set({ isAuthenticated: false });
  },
}));
