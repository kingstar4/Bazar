/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StyleSheet, View, FlatList, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import React, { useEffect } from 'react';
import CusHeaders from '../../customUI/CusHeaders';
import Carousel from './Carousel';
import CustomMainHeader from '../../customUI/CustomMainHeader';
import { vendors } from '../../data/dataTables';
import Vendors from './Vendors';
import { ScrollEvent } from '../../../utils/types';
import { useQuery } from '@tanstack/react-query';
import { fetchHomeBooks } from '../../../api/bookApi';
import { Book } from '../../../utils/types';
import Authors from './Authors';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProtectedParamList } from '../../../utils/types';
import BottomModal from '../../customUI/BottomModal';
import { useAppStore } from '../../../store/useAppStore';
import CardUI from '../../customUI/CardUI';

// import CardUI from '../../customUI/CardUI';
const {width} = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation <NavigationProp<ProtectedParamList>>();
    const [presentIndex, setPresentIndex] = React.useState(0);
    const ref = React.useRef<any>(null);

    // Global Zustand State
    const {selectedBook, setSelectedBook, isModalVisible, setIsModalVisible} = useAppStore();

    const {data: carouselBooks} = useQuery<Book[]>({
      queryKey: ['carouselBooks'],
      queryFn: async () => {
        const books = await fetchHomeBooks('trending');
        return books.slice(0, 4); // Limit to first 4 books
      },
    });

    const {data: topbooks, isLoading} = useQuery<Book[]>({
      queryKey:['topbooks'],
      queryFn: ()=>fetchHomeBooks('best sellers'),
    });

    const handleBookPress = (book: Book) => {
            setSelectedBook(book);
            setIsModalVisible(true);
    };
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
        <CustomMainHeader text="Home" icon="search" onPress={()=>{navigation.navigate('Category')}} icon2="bell"/>

        {carouselBooks && (
          <>
            <FlatList
              data={carouselBooks}
              renderItem={({item}) => <Carousel item={item} onPress={handleBookPress}/>}
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
        {isLoading ? <ActivityIndicator size="large" color="#54408C" style={{marginTop:20}}/> :
        <View style={styles.bookSection}>
          <CusHeaders text="Top of Week"  />
          <FlashList
            data={topbooks}
            renderItem={({ item }) => <CardUI item={item} onPress={handleBookPress} />}
            horizontal
            estimatedItemSize={140}
            contentContainerStyle={styles.flashListContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>
         }

        {/* Vendors Section */}
        <View style={{paddingTop: 10, marginTop:30}}>
          <CusHeaders text="Best Vendors" />
          <FlatList data={vendors} renderItem={Vendors} horizontal keyExtractor={(item)=>item.id} showsHorizontalScrollIndicator={false}/>
        </View>

        {/* Authors Section */}
        <View style={{paddingBottom: 70}}>
          <CusHeaders text="Authors"/>
          <FlatList
            data={topbooks?.slice(0,5)}
            renderItem={Authors}
            scrollEnabled={false}
            keyExtractor={(item)=>item.id}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={4}
          />
        </View>
      </ScrollView>
       {selectedBook && isModalVisible && (
          <BottomModal book={selectedBook} visible={isModalVisible} onClose={()=> setIsModalVisible(false)}/>
        )}
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