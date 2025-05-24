/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import slides from '../../data/slides';


type FooterProps = {
    currentIndex: number;
    nextSlide: () => void;
    skipFunction: () => void;
}


const COLORS = {primary: '#282534', white:'#fff'};
const Footer = ({currentIndex, nextSlide, skipFunction}: FooterProps) => {
  return (
    <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom:100, left: 0, right: 0}}>
            {slides.map((_, index) => <View key={index} style={[styles.indicator, currentIndex === index && {backgroundColor:COLORS.white, width: 6, height: 6, borderRadius: 3}]} />)}
        </View>

        <View style={{position: 'absolute', bottom:20, left: 0, right: 0}}>

            {currentIndex === slides.length - 1 ? <TouchableOpacity onPress={skipFunction}>
                <View style={{backgroundColor: COLORS.white, width: 320, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 20}}>
                    <Text style={{color: COLORS.primary, fontSize: 16, fontWeight: 'bold'}}>Get Started</Text>
                </View>
            </TouchableOpacity> :  <TouchableOpacity onPress={nextSlide}>
                <View style={{backgroundColor: COLORS.white, width: 320, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 20}}>
                    <Text style={{color: COLORS.primary, fontSize: 16, fontWeight: 'bold'}}>Continue</Text>
                </View>
            </TouchableOpacity>
            }
        </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
    indicator:{
        width: 3,
        height: 3,
        borderRadius: 3,
        backgroundColor: 'grey',
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
});