/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Book } from '../../../navigation/types';
import FastImage from 'react-native-fast-image';

type Props = {
    item: Book;
}

const Authors = ({item}: Props) => {
  // const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x100';
  const authorName = item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author';
  const bookImg = item.volumeInfo.imageLinks?.thumbnail;

  const truncateText = (text: string, maxLength:number)=>{
      if(!text) {return '';}
      if(text.length <= maxLength) {return text;}
      return text.substring(0, maxLength).trim() + '...';
  };

  const getBookCount = () => {
    const count = item.volumeInfo.authors?.length || 0;
    return `${count} ${count === 1 ? 'book' : 'books'}`;
  };

  return (
    <View style={styles.authors}>
      <View style={{borderRadius:40, borderWidth:2, borderColor: '#54408C'}}>
        <FastImage
          source={{
            uri: bookImg,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
           style={{width:40, height:40, borderRadius:20, margin:4}}
           resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      <View style={styles.authorInfo}>
        <Text style={styles.authorName} numberOfLines={1}>
          {truncateText(authorName,20)}
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
        maxWidth: 250,
        height: 70,
        marginHorizontal: 8,
        marginBottom: 30,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#f8f8f8',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection:'row',
        gap:10,
        elevation:2,
    },
    authorImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    authorInfo: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    bookCount: {
        textAlign:'left',
        fontSize: 14,
        color: '#54408C',
        fontWeight: '700',
    },
});