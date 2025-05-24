/* eslint-disable react-native/no-inline-styles */
import { Image, StyleSheet, View } from 'react-native';
import React from 'react';

type VendorsProps = {
    item: {
        vImg: any;
    }
}

const Vendors = ({item}: VendorsProps) => {
  return (
    <View style={styles.listStyle}>
        <View>
            <Image source={item.vImg} style={{width:80, height:80, borderRadius:10, marginBottom:5}}/>
        </View>

    </View>
  );
};

export default Vendors;

const styles = StyleSheet.create({
    listStyle:{
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-between',
        padding:20,
        paddingHorizontal:5,
    },

});