/* eslint-disable react-native/no-inline-styles */
import {View } from 'react-native';
import React from 'react';
import OnboardBody from './OnboardBody';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';



const Onboarding = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{flex:1}}>
      <OnboardBody navigation={navigation} />
    </View>
  );
};

export default Onboarding;
