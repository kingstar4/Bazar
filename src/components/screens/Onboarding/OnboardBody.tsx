/* eslint-disable react-native/no-inline-styles */
import {StatusBar, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import slides from '../../data/slides';
import Footer from './Footer';
import Slide from './Slide';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';


type OnboardBodyProps = {
    navigation:  NavigationProp<RootStackParamList>;
}

const { width } = Dimensions.get('window');
const COLORS = {primary: '#282534', white:'#fff'};


const OnboardBody = ({navigation}:OnboardBodyProps) => {
     const [currentIndex, setCurrentIndex] = React.useState(0);
      const ref = React.useRef<FlatList<any>>(null);
      // const horizontalScroll = React.useRef(new Animated.Value(0)).current;

    const scrollFunction = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
     const contentOffsetX: number = event.nativeEvent.contentOffset.x;
     const index: number = Math.round(contentOffsetX / width);
     setCurrentIndex(index);
    };

     const nextSlide = () => {
      if(currentIndex !== slides.length){
          const nextSlideIndex = Math.min(currentIndex + 1, slides.length - 1);
          const offset = nextSlideIndex * width;
          ref?.current?.scrollToOffset({offset, animated: true});
          setCurrentIndex(nextSlideIndex);
      }
     };

     const skipFunction = async () => {
      try {
        await AsyncStorage.setItem('hasLaunched', 'true');
        navigation.navigate('PublicRoutes');
      } catch (error) {
        console.error('Error marking app as launched:', error);
        // navigation.navigate('PublicRoutes');

      }
     };

    return (
      <SafeAreaView style={{ flex:1, backgroundColor: COLORS.primary}}>
        <StatusBar backgroundColor={COLORS.primary} />
        <FlatList data={slides} renderItem={({item})=> <Slide item={item} skipFunction={skipFunction} />} ref={ref} onMomentumScrollEnd={scrollFunction} scrollEventThrottle={16} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={(item)=>item.id} />
        <Footer currentIndex={currentIndex} nextSlide={nextSlide} skipFunction={skipFunction} />
      </SafeAreaView>
    );
};

export default OnboardBody;
