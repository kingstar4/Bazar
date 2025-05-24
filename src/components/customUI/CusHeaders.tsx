/* eslint-disable react-native/no-inline-styles */
import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type CusHeadersProps = {
    text: string;
    text2: string;
    onPress: () => void;
}

const CusHeaders = ({text,text2, onPress}: CusHeadersProps) => {
  return (
    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20}}>
        <Text style={{fontWeight:700, fontSize:18}}>{text}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={{fontWeight:700, fontSize:14, color:'#54408C'}}>{text2}</Text>
        </TouchableOpacity>
    </View>
  );
};

export default CusHeaders;

