// BookCardGrid.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const books = [
  {
    id: '1',
    title: 'The Testaments',
    author: 'Margaret Atwood',
    image: 'https://covers.openlibrary.org/b/id/9871250-L.jpg',
    bgColor: '#EDE3F0',
  },
  {
    id: '2',
    title: 'Daisy Jones And The Six',
    author: 'Taylor Jenkins Reid',
    image: 'https://covers.openlibrary.org/b/id/9871272-L.jpg',
    bgColor: '#FDE2E4',
  },
  {
    id: '3',
    title: 'Fleishman Is In Trouble',
    author: 'Taffy Brodesser-Akner',
    image: 'https://covers.openlibrary.org/b/id/9871203-L.jpg',
    bgColor: '#D9F6EC',
  },
  {
    id: '4',
    title: 'Trust Exercise',
    author: 'Susan Choi',
    image: 'https://covers.openlibrary.org/b/id/9871289-L.jpg',
    bgColor: '#D0ECFF',
  },
];

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  bgColor: string;
}

const BookCard = ({ book }: { book: Book }) => {
  return (
    <View style={[styles.card, { backgroundColor: book.bgColor }]}>
      <Image source={{ uri: book.image }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
    </View>
  );
};

const BookCardGrid = () => {
  const handleCardPress = (book: Book) => {
    Alert.alert(
      'Book Selected',
      `You selected: ${book.title}`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <BookCard book={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default BookCardGrid;
