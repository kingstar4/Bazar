/* eslint-disable react-native/no-inline-styles */
import { Text, View, Dimensions } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import CusButton from '../../customUI/CusButton';
import { Book } from '../../../navigation/types';

type CarouselProps = {
    item: Book;
}

const {width} = Dimensions.get('window');
const Carousel = ({item}: CarouselProps) => {
  const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/135x150';
  const price = item.saleInfo?.listPrice?.amount
    ? `$${item.saleInfo.listPrice.amount}`
    : 'Not for sale';

  return (
    <View style={{flexDirection:'row', display:'flex', width, height:270, position:'relative', marginBottom:20}}>
      <FastImage
          source={require('../../../../assets/img/b2.jpg')}
          style={{width: 400, height:230, position:'absolute', top:0, left:0, zIndex:-1, marginHorizontal:10, marginRight:10, display:'flex', alignSelf:'center', alignItems:'center',justifyContent:'center', borderRadius: 10}}
          resizeMode={FastImage.resizeMode.cover}
        />
      <View style={{flexDirection:'row', display:'flex', width, justifyContent: 'space-between', alignItems:'center', padding:20}}>
        <View style={{alignItems:'flex-start', justifyContent:'center', flexDirection:'column', flex: 1, marginRight: 10, marginLeft:20}}>
          <Text style={{fontWeight:'700', fontSize:20, lineHeight:28, color:'white'}} numberOfLines={2}>
            {item.volumeInfo.title}
          </Text>
          <Text style={{fontSize: 16, color: '#666', marginVertical: 5}}>
            {price}
          </Text>
          {price === 'FREE' ? '' : <CusButton
            buttonStyle={{width:118, alignSelf:'flex-start', borderWidth:2, borderColor:'#fff', backgroundColor:'transparent'}}
            text="Order Now"
            textStyle={{fontSize:14}}
            onPress={()=>{}}
          />}
        </View>
        <View style={{ elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84}}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{width:130, height:150, borderRadius:12}}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </View>
    </View>
  );
};

export default Carousel;

