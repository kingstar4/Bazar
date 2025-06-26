/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
// import Icons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigation/types';

type CustomMainHeaderProps = {
    text: string;
    icon: string;
    icon2: string;
    onPress?: () => void;
}

const CustomMainHeader = ({text,  icon2, onPress}: CustomMainHeaderProps) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
        {/* <TouchableOpacity onPress={onPress}>
          <FontAwesomeIcon name={icon} size={20} />
        </TouchableOpacity> */}
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:'center', gap: 2 }}>
          <FastImage
            source={require('../../../assets/img/app_icon.png')}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode={FastImage.resizeMode.contain}
            />
          <Text style={styles.mainTxt}>{text}</Text>
        </View>
        <TouchableOpacity onPress={onPress} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor:'#E5DEF8', padding: 10, borderRadius: 20 }}>
          <FontAwesomeIcon name={icon2} size={20} color="#54408C" />
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
        alignItems:'center',
        // backgroundColor:'#FAF9FD',
        padding:10,
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