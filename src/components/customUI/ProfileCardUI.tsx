/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type CardUIProps = {
    text: string;
    iconName: string;
}

const CardUI = ({text, iconName }: CardUIProps) => {
  return (
    <TouchableOpacity>
        <View style={styles.cardContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View style={styles.iconContainer}>
                    <IonIcon name={iconName} size={20} color="#54408C"/>
                </View>
                <Text style={{fontSize:16, fontWeight:'600', color:'#121212'}}>{text}</Text>
            </View>
            <View>
                <MaterialIcons name="arrow-forward-ios" color="#A6A6A6" size={24} />
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default CardUI;

const styles = StyleSheet.create({
    cardContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FAF9FD',
    },
});