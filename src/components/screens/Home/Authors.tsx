import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Book } from '../../../navigation/types';

type Props = {
    item: Book;
}

const Authors = ({item}: Props) => {
  // const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x100';
  const authorName = item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author';

  const getBookCount = () => {
    const count = item.volumeInfo.authors?.length || 0;
    return `${count} ${count === 1 ? 'book' : 'books'}`;
  };

  return (
    <View style={styles.authors}>
      <View style={styles.authorInfo}>
        <Text style={styles.authorName} numberOfLines={1}>
          {authorName}
        </Text>
        <Text style={styles.bookCount}>
          {getBookCount()}
        </Text>
      </View>
    </View>
  );
};

export default Authors;

const styles = StyleSheet.create({
    authors:{
        width: 160,
        height: 70,
        marginHorizontal: 8,
        marginBottom: 30,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    authorImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    authorInfo: {
        alignItems: 'center',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    bookCount: {
        fontSize: 14,
        color: '#54408C',
        fontWeight: '700',
    },
});