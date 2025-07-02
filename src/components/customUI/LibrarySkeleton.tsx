import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const { width: screenWidth } = Dimensions.get('window');

// Grid Book Card Skeleton for Library 2-column layout
export const GridBookCardSkeleton: React.FC = () => {
  return (
    <View style={styles.gridCardContainer}>
      <SkeletonLoader width={140} height={180} borderRadius={8} />
      <SkeletonLoader width={120} height={14} borderRadius={4} style={styles.titleSkeleton} />
      <SkeletonLoader width={100} height={12} borderRadius={4} style={styles.authorSkeleton} />
      <SkeletonLoader width={80} height={10} borderRadius={4} style={styles.priceSkeleton} />
    </View>
  );
};

// Library Grid Skeleton - Shows multiple rows of 2-column grid
export const LibraryGridSkeleton: React.FC = () => {
  const renderSkeletonRow = (rowIndex: number) => (
    <View key={rowIndex} style={styles.skeletonRow}>
      <GridBookCardSkeleton />
      <GridBookCardSkeleton />
    </View>
  );

  return (
    <View style={styles.gridContainer}>
      {[1, 2, 3, 4, 5, 6].map((_, index) => renderSkeletonRow(index))}
    </View>
  );
};

// Pagination Loading Skeleton - Small skeleton for bottom loading
export const PaginationSkeleton: React.FC = () => {
  return (
    <View style={styles.paginationContainer}>
      <View style={styles.paginationRow}>
        <GridBookCardSkeleton />
        <GridBookCardSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridCardContainer: {
    width: (screenWidth - 48) / 2, // Account for padding and spacing
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  titleSkeleton: {
    marginTop: 8,
  },
  authorSkeleton: {
    marginTop: 6,
  },
  priceSkeleton: {
    marginTop: 4,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  paginationContainer: {
    marginVertical: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default {
  GridBookCardSkeleton,
  LibraryGridSkeleton,
  PaginationSkeleton,
};