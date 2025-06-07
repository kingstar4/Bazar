import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';


type Props = {}

const New = ({}: Props) => {
  const [isON, setIsOn] = useState(false);

  return (
    <View style={[styles.container, {backgroundColor: isON? 'green': 'red'}]}>
      <View>
        <Text style={styles.txt}>{isON ? 'Turned On' : 'Turned Off'}</Text>
        <Button title={isON ? 'Off' : 'On'} onPress={()=>setIsOn(!isON)}/>
      </View>
    </View>
  );
};

export default New;

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
  },
  txt:{
    fontWeight:'bold',
    fontSize:40,
  },
});