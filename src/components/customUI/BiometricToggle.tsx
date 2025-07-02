/* eslint-disable react-native/no-inline-styles */
import { Switch, Text, View, StyleSheet  } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BiometricToggle = () => {
  const isEnabled = useAppStore((s) => s.isBiometricEnabled);
  const setEnabled = useAppStore((s) => s.setBiometricEnabled);

  // Synchronous for handling the switch
  // The will ensure that the switch updates immediately without needing to wait for a state change

  const handleToggle = (value: boolean) =>{
    useAppStore.setState({ isBiometricEnabled: value });
    setEnabled(value);
  };

  return (

      <View style={styles.cardContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View style={styles.iconContainer}>
                  <MaterialIcons name="fingerprint" size={20} color="#54408C"/>
              </View>
              <Text style={{fontSize:16, fontWeight:'600', color:'#121212'}}>Biometric</Text>
          </View>
          <View>
              <Switch trackColor={{ false: '#767577', true: '#54408C' }} value={isEnabled} onValueChange={handleToggle} />
          </View>
      </View>
  );
};

export default BiometricToggle;

const styles = StyleSheet.create({
    cardContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FAF9FD',
    },
});