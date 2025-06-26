import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React from 'react';
// import { Book } from '../../../utils/types';
import { useAppStore } from '../../../store/useAppStore';

const FavouriteList = () => {
  const favourites = useAppStore(state => state.favourites);

  if (!favourites.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favourite books yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/80x100' }}
                style={styles.bookImage}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.volumeInfo.title}</Text>
                <Text style={styles.author}>{item.volumeInfo.authors?.join(', ') || 'Unknown Author'}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FavouriteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0, // Remove top padding to eliminate header space
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
});