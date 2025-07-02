import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width: skeletonWidth = 100,
  height: skeletonHeight = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E1E9EE', '#F2F8FC'],
  });

  return (
    <Animated.View
      style={[
        {
          width: skeletonWidth,
          height: skeletonHeight,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Book Card Skeleton for horizontal lists
export const BookCardSkeleton: React.FC = () => {
  return (
    <View style={styles.bookCardContainer}>
      <SkeletonLoader width={120} height={160} borderRadius={8} />
      <SkeletonLoader width={100} height={12} borderRadius={4} style={styles.titleSkeleton} />
      <SkeletonLoader width={80} height={10} borderRadius={4} style={styles.authorSkeleton} />
    </View>
  );
};

// Carousel Skeleton
export const CarouselSkeleton: React.FC = () => {
  return (
    <View style={styles.carouselContainer}>
      <SkeletonLoader width={width - 40} height={200} borderRadius={12} />
      <View style={styles.carouselContent}>
        <SkeletonLoader width={150} height={16} borderRadius={4} />
        <SkeletonLoader width={120} height={12} borderRadius={4} style={styles.carouselSubtext} />
        <SkeletonLoader width={100} height={10} borderRadius={4} style={styles.carouselSubtext} />
      </View>
    </View>
  );
};

// Recommended Item Skeleton
export const RecommendedSkeleton: React.FC = () => {
  return (
    <View style={styles.recommendedContainer}>
      <SkeletonLoader width={80} height={100} borderRadius={8} />
      <View style={styles.recommendedContent}>
        <SkeletonLoader width={180} height={14} borderRadius={4} />
        <SkeletonLoader width={140} height={12} borderRadius={4} style={styles.recommendedSubtext} />
        <SkeletonLoader width={100} height={10} borderRadius={4} style={styles.recommendedSubtext} />
        <SkeletonLoader width={60} height={10} borderRadius={4} style={styles.recommendedSubtext} />
      </View>
    </View>
  );
};

// Vendor Skeleton
export const VendorSkeleton: React.FC = () => {
  return (
    <View style={styles.vendorContainer}>
      <SkeletonLoader width={60} height={60} borderRadius={30} />
      <SkeletonLoader width={80} height={10} borderRadius={4} style={styles.vendorName} />
    </View>
  );
};

const styles = StyleSheet.create({
  bookCardContainer: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  titleSkeleton: {
    marginTop: 8,
  },
  authorSkeleton: {
    marginTop: 4,
  },
  carouselContainer: {
    width: width,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  carouselContent: {
    position: 'absolute',
    bottom: 20,
    left: 40,
  },
  carouselSubtext: {
    marginTop: 8,
  },
  recommendedContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  recommendedContent: {
    marginLeft: 15,
    flex: 1,
  },
  recommendedSubtext: {
    marginTop: 6,
  },
  vendorContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  vendorName: {
    marginTop: 8,
  },
});

export default SkeletonLoader;