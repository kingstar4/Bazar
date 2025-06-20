/* eslint-disable react-native/no-inline-styles */
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import CusButton from '../../customUI/CusButton';
import { Book } from '../../../utils/types';
import { truncateText } from '../../../utils/truncate';

type CarouselProps = {
    item: Book;
    onPress: (book: Book)=> void;
}

const {width: screenWidth} = Dimensions.get('window');
const cardWidth = screenWidth - 20;

const Carousel = ({item, onPress}: CarouselProps) => {
  const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/135x150';
  const price = item.saleInfo?.listPrice?.amount
    ? `$${item.saleInfo.listPrice.amount}`
    : 'Not for sale';
  const authors = item.volumeInfo?.authors || ['Unknown Author'];
  return (
    <View style={styles.container}>
      <View style={styles.overlay}/>
      <FastImage
          source={require('../../../../assets/img/nb1.jpg')}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
      />
      <View style={{flexDirection:'row', display:'flex', width: cardWidth, justifyContent: 'space-between', alignItems:'center', paddingVertical:20, paddingHorizontal: 10}}>
        <View style={{alignItems:'flex-start', justifyContent:'center', gap:10, width:30, flexDirection:'column', flex: 1}}>
          <Text style={{fontWeight:'700', fontSize:20, lineHeight:28, color:'white'}} numberOfLines={1}>
            {truncateText(item.volumeInfo.title, 17)}
          </Text>
          <Text style={{color:'#fff'}}>by {truncateText(authors.join(', '), 17)}</Text>
          {/* <Text style={{fontSize: 16, color: '#666', marginVertical: 5}}>
            {price}
          </Text> */}
          {price === 'FREE' ? '' : <CusButton
            buttonStyle={{width:118, alignSelf:'flex-start', backgroundColor: '#fff', elevation: 2}}
            text="View"
            textStyle={{fontSize:14, color:'#000'}}
            onPress={()=>onPress(item)}
          />}
        </View>
        <View style={{ elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84}}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{width:120, height:150, borderRadius:12}}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </View>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  overlay:{
    position: 'absolute',
    backgroundColor:'rgba(0,0,0,0.5)',
    width: cardWidth,
    height: 230,
    borderRadius: 10,
  },
  backgroundImage: {
    width: cardWidth,
    height: 230,
    position: 'absolute',
    borderRadius: 10,
    zIndex: -1,
  },
})
