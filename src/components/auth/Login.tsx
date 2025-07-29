/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import CusButton from '../customUI/CusButton';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PublicStackParamList } from '../../utils/types'; // Adjust the path to your navigation types
import Toast from 'react-native-toast-message';
import { useAppStore } from '../../store/useAppStore';
import { checkBiometric } from '../../utils/checkBiometric';
import * as Keychain from 'react-native-keychain';





type LoginProps = {
    navigation: NativeStackNavigationProp<PublicStackParamList & RootStackParamList, 'Login'>;
}

const Login = ({navigation}: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [biometricLoading, setBiometricLoading] = useState(false);
    const {login} = useAppStore.getState();
    const [isFormValid, setIsFormValid] = useState(false);
    const isEnabled = useAppStore((s) => s.isBiometricEnabled);

   useEffect(() => {
        setIsFormValid(email.trim().length > 0 && password.trim().length > 0);
    }, [email, password]);

    const handleLogin = async() => {
        try {
            setLoading(true);
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const token = await userCredential.user.getIdToken();
            const uid = userCredential.user.uid;

            await login(token, uid);

             // 🔐 Save credentials to Keychain if biometric is enabled
            const isBiometricEnabled = useAppStore.getState().isBiometricEnabled;
            if (isBiometricEnabled) {
            await Keychain.setGenericPassword(email, password, {
                accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                authenticationPrompt: {
                title: 'Authenticate to save your credentials',
                },
                service: 'com.bazar.biometric',
            });
            }


            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
            });
        }
        catch (error: any) {
            let message = 'Something went wrong. Please try again.';

            if (error.code === 'auth/user-not-found') {
                message = 'User not found. Please check your email.';
                console.log('User not found');
            } else if (error.code === 'auth/wrong-password') {
                message = 'Wrong password. Please try again.';
                console.log('Wrong password');
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address. Please check your email.';
                console.log('Invalid email address');
            } else if (error.message && error.message.includes('Failed to fetch user profile')) {
                message = 'Login failed: Unable to fetch your profile. Please contact support or try again later.';
                console.log('Firestore user fetch failed:', error);
            } else {
                console.log('Error logging in:', error);
            }

            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message || message,
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
            });
        }
        finally{
           setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        setBiometricLoading(true);
        try {
            await checkBiometric();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Biometric Login Failed',
                text2: error.message || 'Failed to verify biometrics',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
            });
        } finally {
            setBiometricLoading(false);
        }
    };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{display:'flex', flexDirection:'column',paddingVertical:20}}>
            <View>
                <View style={{display:'flex', flexDirection:'column', alignItems:'flex-start', marginVertical:16, marginTop:40, paddingHorizontal:20}}>
                    <Text style={{fontSize:24, fontWeight:700, lineHeight:32.4, paddingVertical:10}}>Welcome Back 👋</Text>
                    <Text style={{fontWeight:400, fontSize:16, lineHeight:24, color:'#A6A6A6'}}>Sign in to your account</Text>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={{width:327,paddingHorizontal:10, color:'#000'}} placeholder="Your email" placeholderTextColor={'#7b8aa0'} autoCapitalize="none" value={email} onChangeText={(text)=>setEmail(text)} keyboardType="email-address"/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={{width:327,paddingHorizontal:10, color:'#000'}} placeholder="Your password" placeholderTextColor={'#7b8aa0'} value={password} secureTextEntry={!showPassword} onChangeText={(text)=>setPassword(text)}/>
                    <TouchableOpacity style={styles.alignIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Icons name="eye-outline" size={24} color="grey"/> : <Icons name="eye-off-outline" size={24} color="grey"/>}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginVertical:16, paddingHorizontal:20}}>
                <TouchableOpacity onPress={()=>navigation.replace('ForgotPassword')}>
                    <Text style={{color:'#54408C',fontWeight:600, fontSize:14, lineHeight:19.6}}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
            <View>
                {loading ? (
                    <ActivityIndicator size="large" color="#54408C" style={{alignSelf:'center', marginVertical:16}}/>
                ) : (
                    <CusButton buttonStyle={{border:'none',  backgroundColor: isFormValid ? '#54408C' : '#ccc', opacity: isFormValid ? 1 : 0.6}}  disabled={!isFormValid} onPress={handleLogin} text="Login" />
                )}

            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center',alignSelf:'center', width:243, marginVertical:16, justifyContent:'center'}}>
                <Text style={[styles.txt,{color:'#A6A6A6'}]}>Don't have an account? </Text>
                <Text style={[styles.txt,{color:'#54408C'}]} onPress={()=>navigation.replace('Register')}> Register</Text>
            </View>

            {isEnabled &&
                (<TouchableOpacity
                    style={styles.fingerPrint}
                    onPress={handleBiometricLogin}
                >
                    <Icons name="finger-print-outline" size={20} color={'#54408C'} />
                </TouchableOpacity>)
            }
        </View>
        {biometricLoading && (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#54408C" />
                <Text style={styles.loadingText}>Verifying biometrics...</Text>
            </View>
        )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
    line: {
        height: 1,
        width: 158,
        backgroundColor: '#D6D6D6',
    },
    txt:{
        textAlign:'center',
        fontWeight:'500',
        fontSize:16,
    },
    alignIcon:{
        position:'absolute',
        right:0,
        paddingHorizontal:20,
    },
    fingerPrint:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'#e0e5f1',
        alignSelf:'center',
        marginVertical:16,
    },
    textBox:{
        display:'flex',
        flexDirection:'row',
        width:327,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'space-between',
        backgroundColor:'#e0e5f1',
        borderRadius:10,
        marginVertical:16,
    },
    loadingOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#54408C',
        fontWeight: '500',
    },
});
