/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StyleSheet, View, FlatList, Dimensions, ScrollView, TextInput, RefreshControl, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CusHeaders from '../../customUI/CusHeaders';
import Carousel from './Carousel';
import CustomMainHeader from '../../customUI/CustomMainHeader';
import { vendors } from '../../data/dataTables';
import Vendors from './Vendors';
import { HomeParamList, ScrollEvent } from '../../../utils/types';
import { useQuery } from '@tanstack/react-query';
import { fetchHomeBooks } from '../../../api/bookApi';
import { Book } from '../../../utils/types';
// import Authors from './Recommended';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
// import { ProtectedParamList } from '../../../utils/types';
import BottomModal from '../../customUI/BottomModal';
import { useAppStore } from '../../../store/useAppStore';
import { useBookStore } from '../../../store/useBookStore';
import CardUI from '../../customUI/CardUI';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Recommended from './Recommended';
import { TopBooksSkeleton, CarouselSectionSkeleton, RecommendedSectionSkeleton, VendorsSkeleton } from '../../customUI/HomeSkeleton';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');
const imageAspectRatio = 16 / 9;

const Home = () => {
    const navigation = useNavigation<NavigationProp<HomeParamList>>();
    const [presentIndex, setPresentIndex] = useState(0);
    // Use correct type for FlatList ref
    const ref = useRef<FlatList<any>>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isScrolling, setIsScrolling] = React.useState(false);

    // Global Zustand State
    const search = useAppStore((state)=> state.search);
    const setSearch = useAppStore((state)=> state.setSearch);
    const selectedBook = useBookStore((state)=> state.selectedBook);
    const setSelectedBook = useBookStore((state)=> state.setSelectedBook);
    const isModalVisible = useBookStore((state)=> state.isModalVisible);
    const setIsModalVisible = useBookStore((state)=> state.setIsModalVisible);

    // Get refetch functions from react-query
    const {data: carouselBooks, isLoading: isLoadingCarousel, refetch: refetchCarousel} = useQuery<Book[]>({
      queryKey: ['carouselBooks'],
      queryFn: async () => {
        const books = await fetchHomeBooks('trending');
        return books.slice(0, 4); // Limit to first 4 books
      },
    });

    const {data: topbooks, isLoading, refetch: refetchTopbooks} = useQuery<Book[]>({
      queryKey:['topbooks'],
      queryFn: ()=>fetchHomeBooks('best sellers'),
    });

    const {data: history, isLoading: isLoadingHistory, refetch: refetchHistory} = useQuery<Book[]>({
      queryKey:['history'],
      queryFn: ()=>fetchHomeBooks('history'),
    });

    // Memoize handler to avoid unnecessary re-renders
    const handleBookPress = React.useCallback((book: Book) => {
        setSelectedBook(book);
        setIsModalVisible(true);
    }, [setSelectedBook, setIsModalVisible]);

    // Memoize scroll function to avoid recreation
    const scroll = React.useCallback((event: ScrollEvent): void => {
        if (isScrolling) { return; }
        setIsScrolling(true);
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor((contentOffsetX + width / 2) / width);
        if (index !== presentIndex && index >= 0 && index < (carouselBooks?.length || 0)) {
            setPresentIndex(index);
        }
        setTimeout(() => setIsScrolling(false), 150);
    }, [isScrolling, presentIndex, carouselBooks?.length]);

    useEffect(() => {
        // Auto-advance carousel every 3 seconds
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
        }, 3000);
        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [presentIndex, carouselBooks, isScrolling]);

    // Cleanup isScrolling if component unmounts while scrolling
    useEffect(() => {
        return () => setIsScrolling(false);
    }, []);

    // Memoize indicator to avoid unnecessary re-renders
    const indicator = React.useMemo(() => {
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
    }, [carouselBooks, presentIndex]);

    // function to handle search submit
    // Memoize search submit handler
    const handleSearchSubmit = React.useCallback(() => {
      if (search.trim().length > 3) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Library',
            params: { search },
          })
        );
      }
    }, [navigation, search]);

    // Pull-to-refresh handler
    // Memoize pull-to-refresh handler
    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      await Promise.all([
        refetchCarousel(),
        refetchTopbooks(),
        refetchHistory(),
      ]);
      setRefreshing(false);
    }, [refetchCarousel, refetchTopbooks, refetchHistory]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#54408C']} />
        }
      >
        <CustomMainHeader text="Bazar" icon="search" onPress={()=>{navigation.navigate('Notification');}} icon2="bell"/>
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
          {search.length > 0 && (<TouchableOpacity style={styles.clearButton} onPress={()=>setSearch('')}>
            <MaterialIcon name="clear" size={20} color="#666"/>
          </TouchableOpacity>)}
        </View>

        {/* Books Section */}
        <View style={styles.bookSection}>
          <CusHeaders text="Top of Week"  />
          {isLoading ? (
            <TopBooksSkeleton />
          ) : (
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
              keyExtractor={(item, index) => item.id + index}
            />
          )}
        </View>

        {/* Carousel Section */}
        {isLoadingCarousel ? (
          <CarouselSectionSkeleton />
        ) : carouselBooks && (
          <>
            <FlatList
              data={carouselBooks}
              renderItem={({item}) => <Carousel item={item} onPress={handleBookPress}/>}
              onScrollBeginDrag={() => setIsScrolling(true)}
              onScrollEndDrag={() => setIsScrolling(false)}
              onMomentumScrollEnd={scroll}
              ref={ref}
              keyExtractor={(item) => item.id }
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
              {/* indicator is now a memoized array, not a function */}
              {indicator}
            </View>
          </>
        )}

        {/* Vendors Section */}
        {isLoadingHistory ? (
          <VendorsSkeleton />
        ) : (
          <View style={{paddingTop: 10, marginTop: 20}}>
            <View style={styles.imageContainer}>
              <FastImage
                source={require('../../../../assets/img/b2.jpg')}
                style={styles.backgroundImage}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.overlay} />
              <Text style={styles.overlayText}>
                Unlock Your Next Read
              </Text>
            </View>
          </View>
        )}

        {/* Recommended Section */}
        <View style={{paddingBottom: 70}}>
          <CusHeaders text="Recommended"/>
          {isLoadingHistory ? (
            <RecommendedSectionSkeleton />
          ) : (
            <FlatList
              data={history ? Array.from(new Map(history.slice(0, 5).map(item => [item.id, item])).values()) : []}
              renderItem={({item})=> <Recommended item={item} onPress={handleBookPress}/>}
              scrollEnabled={false}
              keyExtractor={(item, index)=> item.id + index}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={4}
            />
          )}
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
    clearButton:{
      padding: 8,
      fontWeight: 'bold',
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
    imageContainer: {
      position: 'relative',
      width: width,
      height: width / imageAspectRatio,
      alignSelf: 'center',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1,
    },
    overlayText: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 26,
      fontWeight: 'bold',
      zIndex: 2,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
      transform: [{ translateY: -13 }], // Half of font size to center vertically
    },
});