/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ProfileCardUIProps = {
    text: string;
    iconName: string;
    onPress?: ()=> void;
}

const ProfileCardUI = ({text, iconName, onPress }: ProfileCardUIProps) => {
  return (
    <Pressable onPress={onPress} >
        <View style={styles.cardContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View style={styles.iconContainer}>
                    <IonIcon name={iconName} size={20} color="#54408C"/>
                </View>
                <Text style={{fontSize:16, fontWeight:'600', color:'#121212'}}>{text}</Text>
            </View>
            <View>
                <MaterialIcons name="arrow-forward-ios" color="#A6A6A6" size={16} />
            </View>
        </View>
    </Pressable>
  );
};

export default ProfileCardUI;

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