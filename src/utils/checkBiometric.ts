import { authenticateBiometric } from '../hooks/useBiometricAuth';
import { useAppStore } from '../store/useAppStore';
import auth from '@react-native-firebase/auth';

// A method to authenticate the user using biometric authentication
// This function checks if biometric authentication is enabled and if the user is logged in.
export const checkBiometric = async () => {
    const { isBiometricEnabled, user, login } = useAppStore.getState();
    if (isBiometricEnabled && user) {
      const result = await authenticateBiometric();
      if (result.success) {
        const token = await auth().currentUser?.getIdToken();
        if (token) {
          await login(token, user.uid); // already stored during last login
        }
      }
    }
  };