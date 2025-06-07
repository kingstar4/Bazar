/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View,TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Icons from 'react-native-vector-icons/Ionicons';
import CusButton from '../customUI/CusButton';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicStackParamList } from '../../navigation/types';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import { validatePass } from '../../hooks/validatePass';

type RegisterProps = {
    navigation: NativeStackNavigationProp<PublicStackParamList, 'Register'>;
}

const Register = ({navigation}: RegisterProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);


    const handleSigUp = async () =>{
        try{
            if (!name || !email || !password){
                Alert.alert('Please fill in all fields');
                return;
            }

            if(password !== confirmPassword){
                Toast.show({
                    type: 'error',
                    text1: 'Passwords do not match',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
                });
                return;
            }

            await auth().createUserWithEmailAndPassword(email, password);
            await firestore().collection('UserDetails')
            .add({
                name,
                email,
                phone,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            console.log('Registration Successful');
            Toast.show({
                type: 'success',
                text1: 'Registration Completed',
                text2: 'Please login with your credentials',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
            });
            setEmail('');
            setName('');
            setPassword('');
            navigation.replace('Login');
        }
        catch(err:any){
            console.log(err.nativeErrorMessage || err.message);

            let errorMessage = 'Registration Failed';

            // Provide more specific error messages based on Firebase error codes
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email is already in use';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Check your connection';
            }

            Toast.show({
                type: 'error',
                text1: errorMessage,
                text2: err.nativeErrorMessage || err.message,
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
            });
        }
    };
    useEffect(()=>{
        const validationFields = name.trim() && email.trim() && password.trim() && confirmPassword.trim() && phone.trim();

        const passwordsMatch = password === confirmPassword;

        const allPasswordRulesPass = validatePass.every(rule => rule.test(password));
        setIsFormValid(!!(validationFields && passwordsMatch && allPasswordRulesPass));

    },[confirmPassword, email, name, password, phone]);

  return (
    <SafeAreaView>
        <View style={{display:'flex', flexDirection:'column'}}>
            <View style={{paddingHorizontal:20, marginTop:20}}>
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
                    <TextInput style={styles.txtInput} placeholder="Your Name" keyboardType="default" value={name} onChangeText={(text)=>setName(text)}/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Your Phone Number" keyboardType="numeric" value={phone} onChangeText={(text)=>setPhone(text)}/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Your Email" keyboardType="email-address" value={email} onChangeText={(text)=>setEmail(text)}/>
                </View>
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Your Password" value={password} secureTextEntry={!showPassword} onChangeText={(text)=>setPassword(text)}/>
                    <TouchableOpacity style={styles.alignIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Icons name="eye-outline" size={24} color="grey"/> : <Icons name="eye-off-outline" size={24} color="grey"/>}
                    </TouchableOpacity>
                </View>
                {password.length > 0 && (
                    <View style={styles.ruleList}>
                        {validatePass.map((rule) => {
                        const passed = rule.test(password);
                        return (
                            <View key={rule.key} style={styles.ruleItem}>
                                <Icons
                                    name={passed ? 'checkmark-circle' : 'close-circle'}
                                    size={18}
                                    color={passed ? 'green' : 'red'}
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{ color: passed ? 'green' : 'red' }}>{rule.label}</Text>
                            </View>
                        );
                        })}
                    </View>
                )}
                <View style={styles.textBox}>
                    <TextInput style={styles.txtInput} placeholder="Confirm password" value={confirmPassword} secureTextEntry={!showPassword} onChangeText={(text)=>setConfirmPassword(text)}/>
                    <TouchableOpacity style={styles.alignIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Icons name="eye-outline" size={24} color="grey"/> : <Icons name="eye-off-outline" size={24} color="grey"/>}
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <CusButton onPress={handleSigUp} text="Register" buttonStyle={{border:'none',  backgroundColor: isFormValid ? '#54408C' : '#ccc', opacity: isFormValid ? 1 : 0.6}}  disabled={!isFormValid} />
            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center',alignSelf:'center', width:243, marginVertical:16, justifyContent:'center'}}>
                <Text style={[styles.txt,{color:'#A6A6A6'}]}>Have an account? </Text>
                <Text style={[styles.txt,{color:'#54408C'}]} onPress={()=>navigation.replace('Login')}> Login</Text>
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
    ruleList: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,

    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:30,
        marginBottom: 4,

    },

});
