import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
// import Icons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigation/types';

type CustomMainHeaderProps = {
    text: string;
    icon: string;
    icon2: string;
    onPress?: () => void;
}

const CustomMainHeader = ({text, icon, icon2, onPress}: CustomMainHeaderProps) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <FontAwesomeIcon name={icon} size={20} />
        </TouchableOpacity>
        <Text style={styles.mainTxt}>{text}</Text>
        <TouchableOpacity>
          <FontAwesomeIcon name={icon2} size={20} />
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