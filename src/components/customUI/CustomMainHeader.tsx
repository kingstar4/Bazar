import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

type CustomMainHeaderProps = {
    text: string;
    icon: string;
    icon2: string;
}

const CustomMainHeader = ({text, icon, icon2}: CustomMainHeaderProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('ProtectedRoutes', { screen: 'Category' } as any)}>
          <Icons name={icon} size={30} />
        </TouchableOpacity>
        <Text style={styles.mainTxt}>{text}</Text>
        <TouchableOpacity>
          <Icons name={icon2} size={30} />
        </TouchableOpacity>
    </View>
  );
};

export default CustomMainHeader;

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:20,
        position:'static',
    },
    mainTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        display:'flex',
        alignItems:'center',
        textAlign:'center',
    },
});