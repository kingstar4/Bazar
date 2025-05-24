import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';

type CusButtonProps = {
    onPress: () => void;
    text: string;
    iconSource?: any;
    Icon?: React.ReactNode;
    buttonStyle?: object;
    textStyle?: object;
    iconStyle?: object;
    disabled?: boolean;
}

const CusButton = ({onPress, text, iconSource, Icon, buttonStyle, textStyle, iconStyle, disabled}:CusButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle, disabled && styles.disabledButton]} disabled={disabled}>
        {iconSource ? (
          <FastImage source={iconSource} style={[styles.icon, iconStyle]}/>
        ) : Icon ? (
          Icon
        ) : null}
        <Text style={[styles.txt, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CusButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width:300,
        borderRadius:48,
        backgroundColor: '#54408C',
        borderWidth: 1,
        borderColor: '#ddd',
        alignSelf:'center',
        marginVertical:10,
    },
    txt:{
        marginLeft:8,
        fontSize: 16,
        fontWeight:500,
        color:'#fff',
    },
    icon:{
        width:16,
        height:16,
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#8F8F8F',
    },
    disabledText: {
        color: '#CCCCCC',
    },
});