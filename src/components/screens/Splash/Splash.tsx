/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native-gesture-handler';

type Props = {}


const Splash = ({}: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, textFadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[{
        width: 200,
        height: 200,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 20,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }]}>
        <FastImage
            source={require('../../../../assets/img/app_icon.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>
      <Animated.View style={[{
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        opacity: textFadeAnim,
      }]}>
        <Text style={styles.text}>Welcome to the app!</Text>
        <Text style={{color:'#fff', fontSize: 16, textAlign:'center'}}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});