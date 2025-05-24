import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface GlowBackgroundProps {
  children: React.ReactNode;
}

const GlowBackground: React.FC<GlowBackgroundProps> = ({ children }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [glowAnim]); // Including glowAnim in dependencies as recommended by ESLint

  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <View style={styles.container}>
      <AnimatedGradient
        colors={['rgba(84, 64, 140, 0.2)', 'rgba(84, 64, 140, 0)', 'rgba(84, 64, 140, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            transform: [
              {
                translateX: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-width, width],
                }),
              },
              {
                translateY: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height, height],
                }),
              },
            ],
          },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: -height,
    left: -width,
    width: width * 3,
    height: height * 3,
    zIndex: 1,
  },
});

export default GlowBackground;
