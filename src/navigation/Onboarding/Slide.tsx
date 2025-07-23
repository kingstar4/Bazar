/* eslint-disable react-native/no-inline-styles */
import { Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import slides from '../../components/data/slides';

type SlideProps = {
    item: {
        slideImg: any;
        title: string;
        subTitle: string;
    };
    skipFunction: () => void;
    slideIndex: number;
}

const COLORS = {primary: '#282534', white:'#fff'};
const { width } = Dimensions.get('window');

// Slide component to render each slide in the onboarding process
const Slide = ({item, skipFunction, slideIndex}: SlideProps) => {
  const isLastSlide = slideIndex === slides.length - 1; // Check if this is the last slide
  
  return (
    <View style={{ backgroundColor: COLORS.primary , flex: 1, paddingHorizontal: 14, width:width, paddingTop:14}}>

        {item.slideImg.length !== -1 && !isLastSlide && (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 20}}>
                <TouchableOpacity onPress={skipFunction}>
                    <Text style={{color:COLORS.white, fontSize:17, fontWeight:500}}>Skip</Text>
                </TouchableOpacity>
            </View>
        )}
        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
            <Image source={item.slideImg} style={{width: 320, height: 320, top:20, alignSelf:'center', justifyContent:'center'}}/>
            <View style={{alignItems: 'center', justifyContent: 'center', marginTop:30}}>
                <Text style={{color: COLORS.white, fontSize: 24, fontWeight: 'bold', textAlign: 'center', width:243, height:64}}>{item.title}</Text>
                <Text style={{color: COLORS.white, fontSize: 16, textAlign: 'center', marginTop: 10, marginHorizontal: 20, width:292, height:72, lineHeight:24}}>{item.subTitle}</Text>
            </View>
        </View>
    </View>
  );
};

export default Slide;

