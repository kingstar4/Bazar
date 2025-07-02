import ReactNativeBiometrics from 'react-native-biometrics';

export const authenticateBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    const {available, biometryType} = await rnBiometrics.isSensorAvailable();
    if (!available) {return { success: false, message: 'Biometric auth not available'};}

    const result = await rnBiometrics.simplePrompt({
        promptMessage: biometryType === 'FaceID' ? 'Use Face ID' : 'Use Fingerprint',
    });

    if (result) {
        return { success: true };
    } else {
        return { success: false, message: 'Biometric authentication failed' };
    }
};