/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StyleSheet, View, FlatList, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import React, { useEffect } from 'react';
import CusHeaders from '../../customUI/CusHeaders';
import Carousel from './Carousel';
import CustomMainHeader from '../../customUI/CustomMainHeader';
import { vendors } from '../../data/dataTables';
import Vendors from './Vendors';
import { ScrollEvent } from '../../../navigation/types';
import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from '../../../api/bookApi';
import { Book } from '../../../navigation/types';
import Books from './Books';
import Authors from './Authors';
import { FlashList } from '@shopify/flash-list';
// import CardUI from '../../customUI/CardUI';

const {width} = Dimensions.get('window');

const Home = () => {
    const [presentIndex, setPresentIndex] = React.useState(0);
    const ref = React.useRef<any>(null);

    const {data: carouselBooks} = useQuery<Book[]>({
      queryKey: ['carouselBooks'],
      queryFn: async () => {
        const books = await fetchBooks('featured books');
        return books.slice(0, 4); // Limit to first 4 books
      },
    });

    const {data: topbooks, isLoading} = useQuery<Book[]>({
      queryKey:['topbooks'],
      queryFn: ()=>fetchBooks('best sellers'),
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselBooks) {
                const nextIndex = (presentIndex + 1) % carouselBooks.length;
                setPresentIndex(nextIndex);
                ref.current?.scrollToIndex({
                    animated: true,
                    index: nextIndex,
                });
            }
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [presentIndex, carouselBooks]);

    // Scroll function
    const scroll = (event: ScrollEvent): void => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        if (index !== presentIndex) {
            setPresentIndex(index);
        }
    };

    const indicator = () => {
        return carouselBooks?.map((_, index) => (
            <View
                key={index.toString()}
                style={[
                    styles.indicator,
                    presentIndex === index && {
                        backgroundColor:'#54408C',
                        width:6,
                        height:6,
                        borderRadius:5,
                    },
                ]}
            />
        ));
    };

  return (
    <SafeAreaView style={{flex:1, paddingVertical:20, marginTop:20}}>
      <ScrollView>
        <CustomMainHeader text="Home" icon="search-outline" icon2="notifications-outline"/>

        {carouselBooks && (
          <>
            <FlatList
              data={carouselBooks}
              renderItem={({item}) => <Carousel item={item} />}
              onScroll={scroll}
              ref={ref}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              {indicator()}
            </View>
          </>
        )}


        {/* Books Section */}
        {isLoading ? <ActivityIndicator size="large" color="#0000ff" style={{marginTop:20}}/> :
        <View style={styles.bookSection}>
          <CusHeaders text="Top of Week" text2="Show all" onPress={()=>{}}/>
          <FlashList
            data={topbooks}
            renderItem={Books}
            horizontal
            estimatedItemSize={140}
            contentContainerStyle={styles.flashListContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        }

        {/* Vendors Section */}
        <View style={{paddingTop: 10, marginTop:30}}>
          <CusHeaders text="Best Vendors" text2="Show all" onPress={()=>{}}/>
          <FlatList data={vendors} renderItem={Vendors} horizontal keyExtractor={(item)=>item.id} showsHorizontalScrollIndicator={false}/>
        </View>

        {/* Authors Section */}
        <View style={{paddingBottom: 70}}>
          <CusHeaders text="Authors" text2="See all" onPress={()=>{}}/>
          <FlatList
            data={topbooks?.filter(book => book.volumeInfo.authors && book.volumeInfo.authors.length > 0)}
            renderItem={Authors}
            horizontal
            keyExtractor={(item)=>item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
    mainTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        display:'flex',
        alignItems:'center',
        textAlign:'center',
    },
    indicator:{
      backgroundColor:'grey',
      width:3,
      height:3,
      marginHorizontal:5,
      borderRadius:2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookSection:{
      height: 260,
      width: '100%',
      marginVertical: 10,
    },
    flashListContainer: {
      paddingHorizontal: 10,
    },
});