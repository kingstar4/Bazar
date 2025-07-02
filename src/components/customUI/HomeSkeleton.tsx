import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { BookCardSkeleton, CarouselSkeleton, RecommendedSkeleton, VendorSkeleton } from './SkeletonLoader';

// Top Books Section Skeleton
export const TopBooksSkeleton: React.FC = () => {
  const renderBookCard = () => <BookCardSkeleton />;

  return (
    <View style={styles.sectionContainer}>
      <FlatList
        data={[1, 2, 3, 4, 5]} // Show 5 skeleton cards
        renderItem={renderBookCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );
};

// Carousel Section Skeleton
export const CarouselSectionSkeleton: React.FC = () => {
  return (
    <View style={styles.carouselSection}>
      <CarouselSkeleton />
      {/* Indicator dots skeleton */}
      <View style={styles.indicatorContainer}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.indicatorDot} />
        ))}
      </View>
    </View>
  );
};

// Vendors Section Skeleton
export const VendorsSkeleton: React.FC = () => {
  const renderVendor = () => <VendorSkeleton />;
  
  return (
    <View style={styles.sectionContainer}>
      <FlatList
        data={[1, 2, 3, 4, 5]} // Show 5 skeleton vendors
        renderItem={renderVendor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );
};

// Recommended Section Skeleton
export const RecommendedSectionSkeleton: React.FC = () => {
  return (
    <View style={styles.recommendedSection}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <RecommendedSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    height: 260,
    width: '100%',
    marginVertical: 10,
    marginBottom: 30,
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  carouselSection: {
    marginVertical: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  indicatorDot: {
    backgroundColor: '#E1E9EE',
    width: 6,
    height: 6,
    marginHorizontal: 5,
    borderRadius: 3,
  },
  recommendedSection: {
    paddingBottom: 70,
  },
});

export default {
  TopBooksSkeleton,
  CarouselSectionSkeleton,
  VendorsSkeleton,
  RecommendedSectionSkeleton,
};