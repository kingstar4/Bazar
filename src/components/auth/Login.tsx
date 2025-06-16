/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';
import CusButton from '../customUI/CusButton';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PublicStackParamList } from '../../navigation/types'; // Adjust the path to your navigation types
// import { useAuthStore } from '../../store/useAuthStore';
import Toast from 'react-native-toast-message';
import { useAppStore } from '../../store/useAppStore';

type LoginProps = {
    navigation: NativeStackNavigationProp<PublicStackParamList & RootStackParamList, 'Login'>;
}

const Login = ({navigation}: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
    // const setUserDetails = useAuthStore((state) => state.setUserDetails);

    const handleLogin = async()=>{
        const {login} = useAppStore.getState();
        try {
            // setLoading(true);
            // const userCredential = await auth().signInWithEmailAndPassword(email, password);
            // const user = userCredential.user;
            // // Store user details in Zustand store
            // setUserDetails(user.email, user.uid, user.displayName);
            // setAuthenticated(true);
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const token = await userCredential.user.getIdToken();
            const uid = userCredential.user.uid;

            await login(token, uid);

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
            }
            else {
                console.log('Error logging in:', error);
            }

            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: message,
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

  return (
    <SafeAreaView>
        <View style={{display:'flex', flexDirection:'column',paddingVertical:20}}>
            <View>
                <View style={{display:'flex', flexDirection:'column', alignItems:'flex-start', marginVertical:16, marginTop:40, paddingHorizontal:20}}>
                    <Text style={{fontSize:24, fontWeight:700, lineHeight:32.4, paddingVertical:10}}>Welcome Back 👋</Text>
                    <Text style={{fontWeight:400, fontSize:16, lineHeight:24, color:'#A6A6A6'}}>Sign in to your account</Text>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={{width:327,paddingHorizontal:10}} placeholder="Your email" value={email} onChangeText={(text)=>setEmail(text)} keyboardType="email-address"/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={{width:327,paddingHorizontal:10}} placeholder="Your password" value={password} secureTextEntry={!showPassword} onChangeText={(text)=>setPassword(text)}/>
                    <TouchableOpacity style={styles.alignIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Icons name="eye-outline" size={24} color="grey"/> : <Icons name="eye-off-outline" size={24} color="grey"/>}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginVertical:16, paddingHorizontal:20}}>
                <Text style={{color:'#54408C',fontWeight:600, fontSize:14, lineHeight:19.6}}>Forgot password?</Text>
            </View>
            <View>
                {loading ? (
                    <ActivityIndicator size="large" color="#54408C" style={{alignSelf:'center', marginVertical:16}}/>
                ) : (
                    <CusButton onPress={handleLogin} text="Login" buttonStyle={{border:'none'}} />
                )}

            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center',alignSelf:'center', width:243, marginVertical:16, justifyContent:'center'}}>
                <Text style={[styles.txt,{color:'#A6A6A6'}]}>Don't have an account? </Text>
                <Text style={[styles.txt,{color:'#54408C'}]} onPress={()=>navigation.replace('Register')}> Register</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginVertical:16, width:375, justifyContent:'space-between'}}>
                <View style={styles.line} />
                <Text style={{color:'#A6A6A6', fontWeight:'400', fontSize:14, lineHeight:19.6}}>Or with</Text>
                <View style={styles.line}/>
            </View>
            <View>
                {/* <CusButton onPress={{}} iconSource={require('../../../assets/img/googleicon.png')} buttonStyle={{backgroundColor:'transparent'}} text="Sign in with Google" textStyle={{color:'#121212'}}/>
                <CusButton onPress={{}} iconSource={require('../../../assets/img/appleicon.jpg')} buttonStyle={{backgroundColor:'transparent'}} text="Sign in with Apple" textStyle={{color:'#121212'}}/> */}
            </View>
        </View>
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
});