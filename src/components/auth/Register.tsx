/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View,TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Icons from 'react-native-vector-icons/Ionicons';
import CusButton from '../customUI/CusButton';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicRoutes} from '../../navigation/types';
import Toast from 'react-native-toast-message';

type RegisterProps = {
    navigation: NativeStackNavigationProp<PublicRoutes, 'Register'>;
}

const Register = ({navigation}: RegisterProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSigUp = async () =>{
        // auth().createUserWithEmailAndPassword(email, password).then(async ()=>{
        //     // Sign out immediately after registration
        //     await auth().signOut();
        try{
            auth().createUserWithEmailAndPassword(email, password);
            Toast.show({
                type: 'success',
                text1: 'Registration Completed',
                text2: 'Please login with your credentials',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
            });
            navigation.replace('Login');
        }catch(err:any){
            console.log(err.nativeErrorMessage);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: err.nativeErrorMessage,
                position: 'top',
            });
        };
    };
  return (
    <SafeAreaView>
        <View style={{display:'flex', flexDirection:'column'}}>
            <View style={{paddingHorizontal:20, marginTop:30}}>
                <TouchableOpacity onPress={()=>navigation.replace('Login')}>
                    <FontAwesome6 name="arrow-left" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <View>
                <View style={{display:'flex', flexDirection:'column', alignItems:'flex-start', marginVertical:16, marginTop:20, paddingHorizontal:20}}>
                    <Text style={{fontSize:24, fontWeight:700, lineHeight:32.4, paddingVertical:10}}>Sign Up</Text>
                    <Text style={{fontWeight:400, fontSize:16, lineHeight:24, color:'#A6A6A6'}}>Create account and choose favorite menu</Text>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Your Name"/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Your email" keyboardType="email-address" value={email} onChangeText={(text)=>setEmail(text)}/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Your password" value={password} secureTextEntry={!showPassword} onChangeText={(text)=>setPassword(text)}/>
                    <TouchableOpacity style={styles.alignIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Icons name="eye-outline" size={24} color="grey"/> : <Icons name="eye-off-outline" size={24} color="grey"/>}
                    </TouchableOpacity>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Confirm password" value={confirmPassword} secureTextEntry={!showPassword} onChangeText={(text)=>setConfirmPassword(text)}/>
                    <TouchableOpacity style={styles.alignIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Icons name="eye-outline" size={24} color="grey"/> : <Icons name="eye-off-outline" size={24} color="grey"/>}
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <CusButton onPress={handleSigUp} text="Register" buttonStyle={{border:'none'}} />
            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center',alignSelf:'center', width:243, marginVertical:16, justifyContent:'center'}}>
                <Text style={[styles.txt,{color:'#A6A6A6'}]}>Have an account? </Text>
                <Text style={[styles.txt,{color:'#54408C'}]} onPress={()=>navigation.replace('Login')}> Sign In</Text>
            </View>
            <View style={{display:'flex', flexDirection:'column', alignItems:'center',position:'absolute', bottom:-170, alignSelf:'center',justifyContent:'center'}}>
                <Text style={{fontSize:14, fontWeight:500, lineHeight:19.6, textAlign:'center', color:'#A6A6A6'}}>By clicking Register, you agree to our</Text>
                <Text style={{fontSize:14, fontWeight:500, lineHeight:19.6, textAlign:'center', color:'#54408C'}}>Terms and Data Policy</Text>
            </View>
        </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
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
    txt:{
        textAlign:'center',
        fontWeight:'500',
        fontSize:16,
    },
    txtInput:{
        width:270,
        height:48,
        paddingHorizontal:10,
    },
});