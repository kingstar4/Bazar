import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Props = {}

const Splash = ({}: Props) => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Splash Screen</Text>
        <Text style={styles.text}>Welcome to the app!</Text>
        <Text>Loading...</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});