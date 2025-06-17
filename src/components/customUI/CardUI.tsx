/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import IonIcon from 'react-native-vector-icons/Ionicons';
import { Book } from '../../utils/types';
import { getColorFromId } from '../../utils/getColorFromID';
import FastImage from 'react-native-fast-image';

type CardUIProps = {
    item: Book;
    onPress: (book: Book)=> void;
}

const CardUI = ({item, onPress}:CardUIProps) => {
    const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/135x150';
    const sale = item.saleInfo;
    const authors = item.volumeInfo?.authors;
    const getPriceText = () => {
      if (sale?.saleability === 'FOR_SALE') {
        if (sale.retailPrice) {
          return `${sale.retailPrice.amount.toFixed(2)} ${sale.retailPrice.currencyCode}`;
        } else if (sale.listPrice) {
          return `${sale.listPrice.amount.toFixed(2)} ${sale.listPrice.currencyCode}`;
        }
      }
      return item.saleInfo?.saleability === 'FREE' ? 'Free' : 'Not for Sale';
    };

  return (
    <View style={styles.bookList}>
      <Pressable onPress={()=>onPress(item)}>
          <View style={[styles.cardBody, {backgroundColor: getColorFromId(item.id)}]}>
            <View style={{marginBottom:60,  width:100, height:150, display:'flex', alignItems:'center', justifyContent:'center', elevation:6, borderRadius:12, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0, height:2}, shadowOpacity:0.25, shadowRadius:3.84, backgroundColor:'#fff'}}>
              <FastImage
                source={{
                  uri: imageUrl,
                  priority: FastImage.priority.normal,
                }}
                style={{width:100, height:150, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:12}}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          </View>

          <View style={{paddingHorizontal: 8, paddingVertical: 4, display:'flex', alignItems:'flex-start', justifyContent:'center', backgroundColor:'transparent'}}>
            <Text style={{marginLeft:3, fontWeight:700}} numberOfLines={1}>
              {item.volumeInfo.title}
            </Text>
            {authors ? ( <Text style={{paddingVertical:6}} numberOfLines={1}> by {authors}</Text>) : <Text style={{marginLeft:3}}>Unknown</Text>}
            
            <View style={{backgroundColor: 'rgba(84, 64, 140, 0.1)', borderRadius: 16,paddingHorizontal: 6, paddingVertical: 6,}}>
              <Text style={{paddingLeft:5, color: '#54408C', fontSize:12,  fontWeight: '500',}}>
                {getPriceText()}
              </Text>
            </View>
          </View>
      </Pressable>
      </View>
  );
};

export default CardUI;

const styles = StyleSheet.create({
    cardContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        backgroundColor:'#000',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FAF9FD',
    },
    bookList:{
        display:'flex',
        alignItems:'center',
        justifyContent:'flex-end',
        flexDirection:'column',
        backgroundColor:'transparent',
        width:170,
        height:250,
        marginHorizontal: 6,
        marginBottom: 40,
        paddingHorizontal: 8,
        borderRadius: 12,

    },
    cardBody:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        width:170,
        height:120,
        borderRadius: 12,
    },
});