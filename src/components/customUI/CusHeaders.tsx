/* eslint-disable react-native/no-inline-styles */
import { Text, View} from 'react-native';
import React from 'react';

type CusHeadersProps = {
    text: string;
}

const CusHeaders = ({text}: CusHeadersProps) => {
  return (
    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20}}>
        <Text style={{fontWeight:700, fontSize:18}}>{text}</Text>
    </View>
  );
};

export default CusHeaders;

