import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
type Props = {}



const Notification = ({}: Props) => {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications-off" size={20} color="#ccc"/>
      <Text style={styles.text}>No Notifications yet</Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#fff',
    },
    text: {
        fontSize: 18,
        color: '#121212',
    },
});