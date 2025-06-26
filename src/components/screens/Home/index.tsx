/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StyleSheet, View, FlatList, Dimensions, ScrollView, ActivityIndicator, TextInput} from 'react-native';
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
// import Authors from './Recommended';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProtectedParamList } from '../../../utils/types';
import BottomModal from '../../customUI/BottomModal';
import { useAppStore } from '../../../store/useAppStore';
import CardUI from '../../customUI/CardUI';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Recommended from './Recommended';



const {width} = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation<NavigationProp<ProtectedParamList>>();
    const [presentIndex, setPresentIndex] = React.useState(0);
    const ref = React.useRef<FlatList>(null);
    const [search, setSearch] = React.useState('');

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

    const {data: history, isLoading: isLoadingHistory} = useQuery<Book[]>({
      queryKey:['history'],
      queryFn: ()=>fetchHomeBooks('history'),
    });

    const handleBookPress = (book: Book) => {
            setSelectedBook(book);
            setIsModalVisible(true);
    };
    const [isScrolling, setIsScrolling] = React.useState(false);

    // Update scroll function with debouncing
    const scroll = (event: ScrollEvent): void => {
        if (isScrolling) { return; }

        setIsScrolling(true);
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor((contentOffsetX + width / 2) / width);

        if (index !== presentIndex && index >= 0 && index < (carouselBooks?.length || 0)) {
            setPresentIndex(index);
        }

        setTimeout(() => setIsScrolling(false), 150);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselBooks && !isScrolling) {
                const nextIndex = (presentIndex + 1) % carouselBooks.length;
                setPresentIndex(nextIndex);
                ref.current?.scrollToIndex({
                    animated: true,
                    index: nextIndex,
                    viewPosition: 0.5,
                });
            }
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [presentIndex, carouselBooks, isScrolling]);

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

    // Add this function to handle search submit
    const handleSearchSubmit = () => {
      if (search.trim().length > 0) {
        // Use jumpTo for tab navigation
        // @ts-ignore
        navigation.jumpTo('Library', { search });
      }
      setSearch('');

    };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <CustomMainHeader text="Bazar" icon="search" onPress={()=>{}} icon2="bell"/>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search book..."
            placeholderTextColor={'#bfbec5'}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
            }}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
        {/* Books Section */}
        {isLoading ? <ActivityIndicator size="large" color="#54408C" style={{marginTop:20}}/> :
        <View style={styles.bookSection}>
          <CusHeaders text="Top of Week"  />
          <FlashList
            data={topbooks}
            renderItem={({ item }) => (
            <View style={{marginHorizontal:5}}>
              <CardUI item={item} onPress={handleBookPress} />
            </View>
          )}
            horizontal
            estimatedItemSize={140}
            contentContainerStyle={styles.flashListContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>
         }

        {carouselBooks && (
          <>
            <FlatList
              data={carouselBooks}
              renderItem={({item}) => <Carousel item={item} onPress={handleBookPress}/>}
              onScrollBeginDrag={() => setIsScrolling(true)}
              onScrollEndDrag={() => setIsScrolling(false)}
              onMomentumScrollEnd={scroll}
              ref={ref}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              decelerationRate="fast"
              snapToAlignment="center"
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



        {/* Vendors Section */}
        <View style={{paddingTop: 10,marginTop:20}}>
          <CusHeaders text="Best Vendors" />
          <FlatList data={vendors} renderItem={Vendors} horizontal keyExtractor={(item)=>item.id} showsHorizontalScrollIndicator={false}/>
        </View>

        {/* Recommended Section */}
        {isLoadingHistory ? <ActivityIndicator size="large" color="#54408C" style={{marginTop:20}}/> :
        <View style={{paddingBottom: 70}}>
          <CusHeaders text="Recommended"/>
          <FlatList
            data={history?.slice(0,5)}
            renderItem={({item})=> <Recommended item={item} onPress={handleBookPress}/>}
            scrollEnabled={false}
            keyExtractor={(item)=>item.id}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={4}
          />
        </View>
        }

      </ScrollView>
       {selectedBook && isModalVisible && (
          <BottomModal book={selectedBook} visible={isModalVisible} onClose={()=> setIsModalVisible(false)}/>
        )}

    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor: '#fff',
    },
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
      marginBottom: 30,
    },
    flashListContainer: {
      paddingHorizontal: 10,
    },
    searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',

  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf:'center',
      marginHorizontal: 20,
      marginVertical: 10,
      backgroundColor: '#f2f2f4',
      borderRadius: 25,
      borderWidth: 0,
      paddingHorizontal: 12,
      flex: 1,
      marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
});