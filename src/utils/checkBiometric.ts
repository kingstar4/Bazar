// import { authenticateBiometric } from '../hooks/useBiometricAuth';
import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
import { useAppStore } from '../store/useAppStore';
import auth from '@react-native-firebase/auth';

// A method to authenticate the user using biometric authentication
// This function checks if biometric authentication is enabled and if the user is logged in.
export const checkBiometric = async () => {
    const { isBiometricEnabled, login } = useAppStore.getState();

    if (!isBiometricEnabled) {return;}

  try {
    // 🔓 Prompt biometric authentication & retrieve saved credentials
    const credentials = await Keychain.getGenericPassword({
      authenticationPrompt: {
        title: 'Login with Biometrics',
      },
      service: 'com.bazar.biometric',
    });

    if (credentials) {
      const { username: email, password } = credentials;
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      await login(token, userCredential.user.uid);
    }
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    Toast.show({
      type: 'error',
      text1: 'Biometric Authentication Failed',
      text2: 'Please try again or log in with your email and password.',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  }
};