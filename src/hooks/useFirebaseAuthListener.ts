
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useAppStore } from '../store/useAppStore';

export const useFirebaseAuthListener = () => {
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        login(token); // saves token and updates isAuthenticated
      } else {
        logout(); // removes token and updates isAuthenticated
      }
    });

    return () => unsubscribe();
  }, [login, logout]);
};
