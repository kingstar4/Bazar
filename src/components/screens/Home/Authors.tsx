/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { Book } from '../../../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { truncateText } from '../../../utils/truncate';

type Props = {
    item: Book | null;
}

const {width: screenWidth} = Dimensions.get('window');

const Authors = ({item}: Props) => {

  if(!item){
    return null;
  }
  // const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x100';
  const authorName = item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author';
  const bookImg = item.volumeInfo.imageLinks?.thumbnail;
  const{ title} = item.volumeInfo;


  // const getBookCount = () => {
  //   const count = item.volumeInfo.authors?.length || 0;
  //   return `${count} ${count === 1 ? 'book' : 'books'}`;
  // };

  return (
    // <View style={styles.authors}>
    //   <View style={{borderRadius:40, borderWidth:2, borderColor: '#54408C'}}>
    //     <FastImage
    //       source={{
    //         uri: bookImg,
    //         priority: FastImage.priority.normal,
    //         cache: FastImage.cacheControl.immutable,
    //       }}
    //        style={{width:40, height:40, borderRadius:20, margin:4}}
    //        resizeMode={FastImage.resizeMode.cover}
    //     />
    //   </View>

    //   <View style={styles.authorInfo}>
    //     <Text style={styles.authorName} numberOfLines={1}>
    //       {truncateText(authorName,20)}
    //     </Text>
    //     <Text style={styles.bookCount}>
    //       {getBookCount()}
    //     </Text>
    //   </View>
    // </View>
    <View style={styles.container}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: '100%'}}>
        <View style={{gap:20, flexDirection:'row', alignItems:'center'}}>
          {/* Book Image */}
          <View style={styles.imgContainer}>
            <FastImage
              source={{
                uri: bookImg || 'https://via.placeholder.com/135x150',
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.bookImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View>
            <Text numberOfLines={1}>{truncateText(title, 16)}</Text>
            <Text numberOfLines={1}>{truncateText(authorName, 20)}</Text>
            {/* Rating */}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= (item.volumeInfo.averageRating || 4) ? 'star' : 'star-outline'}
                  size={16}
                  color="#FFD700"
                  style={{marginRight: 2}}
                />
              ))}
              <Text style={styles.ratingText}>
                {item.volumeInfo.averageRating || '4.0'}
                {/* <Text style={styles.ratingCount}>
                  ({item.volumeInfo.ratingsCount || '120'} reviews)
                </Text> */}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor:'#E5DEF8' , borderRadius: 50, width: 40, height: 40, alignItems:'center', justifyContent:'center'}}>
          <FontAwesome6Icon name="plus" size={20} color="#54408C"/>
        </View>
      </View>
    </View>
  );
};

export default Authors;

const styles = StyleSheet.create({
      container:{
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: screenWidth - 20 ,
        marginBottom:30,
        backgroundColor: '#fff',
        borderRadius:20,
        padding: 20,
      },

     ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
    },
    ratingCount: {
      fontSize: 12,
      color: '#888',
      fontWeight: '400',
    },
    bookImage: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    imgContainer: {
      position: 'relative',
      width: 90,
      height: 120,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
  },

});