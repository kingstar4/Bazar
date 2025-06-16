import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useFirebaseAuthListener = () => {
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const uid = firebaseUser.uid;

        console.log('User signed in → calling login with uid:', uid);

        await login(token, uid);
      } else {
        console.log('User signed out → calling logout');
        await logout();
      }
    });

    return unsubscribe;
  }, [login, logout]);
};
