/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchBooks } from '../../../api/bookApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomModal from '../../customUI/BottomModal';
import BottomSheetFilter from '../../customUI/BottomSheetFilter';
import CardUI from '../../customUI/CardUI';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Book, ProtectedParamList } from '../../../utils/types';
import { NavigationProp } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import { LibraryGridSkeleton, PaginationSkeleton } from '../../customUI/LibrarySkeleton';
import { useAppStore } from '../../../store/useAppStore';


type Props = {
  navigation: NavigationProp<ProtectedParamList>;
}

const {width: screenWidth} = Dimensions.get('window');
const Library = ({navigation}: Props) => {
  const  {search, setSearch} = useAppStore((state) => state);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('fiction');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [sortAZ, setSortAZ] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Debounce search term
  useEffect(() => {
      if (search.length < 3) {
          setDebouncedSearch('');
          return;
      }
      const timer = setTimeout(() => {
          setDebouncedSearch(search);
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
  }, [search]);

  const handleBookPress = useCallback((book: Book) => {
      setSelectedBook(book);
      setIsModalVisible(true);
  }, [setSelectedBook, setIsModalVisible]);

  const onRefresh = async () =>{
    setRefreshing(true);
    refetchBooks();
    setRefreshing(false);

  };


  // Use debounced search term for the query
  const activeQuery = debouncedSearch ? debouncedSearch : `subject:${selectedCategory}`;

const {
  data,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  error,
  isError,
  refetch: refetchBooks,
} = useInfiniteQuery({
  queryKey: ['books', activeQuery],
  queryFn: ({ pageParam = 0 }) => fetchBooks(activeQuery, pageParam),
   initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage,
  staleTime: 1000 * 60 * 5,
});

const books = useMemo(() => {
  if (!data?.pages) {return [];}

  // Flatten all pages and remove duplicates based on book ID
  const allBooks = data.pages.flatMap((page) => page.items) || [];
  const uniqueBooks = allBooks.filter((book, index, self) =>
    index === self.findIndex((b) => b.id === book.id)
  );

  return uniqueBooks;
}, [data]);

    // Function for Empty States
    const renderEmptyState = () => {
      if (isError) {
        if (error instanceof Error) {
          // Network error check
          if (error.message.includes('Network') || error.message.includes('ECONNREFUSED')) {
            return (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="cloud-offline" size={50} color="#666" />
                <Text style={styles.emptyStateText}>
                  Network error. Please check your connection and try again.
                </Text>
              </View>
            );
          }
        }
        return (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="alert-circle" size={50} color="#666" />
            <Text style={styles.emptyStateText}>
              Something went wrong. Please try again later.
            </Text>
          </View>
        );
      }
      // No results found
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="search" size={50} color="#666" />
          <Text style={styles.emptyStateText}>
            {debouncedSearch
              ? `No books found for "${debouncedSearch}"`
              : `No books found in ${selectedCategory} category`}
          </Text>
        </View>
      );
    };

    const handleCategorySelection = (category: string)=>{
      setSelectedCategory(category);
      setIsOpen(false);
    };

    const handleSortAZ = () =>{
      setSortAZ(true);
      setIsOpen(false);
    };

    const sortedData = useMemo(() => {
  if (!sortAZ) {return books;}
  return [...books].sort((a, b) =>
    a.volumeInfo.title.toUpperCase().localeCompare(b.volumeInfo.title.toUpperCase())
  );
}, [books, sortAZ]);


    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <View style={styles.container}>

          <View style={styles.row}>
            <TouchableOpacity style={{  padding: 10}} onPress={()=>{navigation.goBack()}}>
              <Ionicons name="chevron-back" size={24} color="#333"  />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Library</Text>

            <TouchableOpacity onPress={()=> setIsOpen(true)} style={{padding: 10, backgroundColor:'#E5DEF8',  borderRadius: 50}}>
              <Ionicons name="filter" size={24} color="#54408C" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search books..."
                placeholderTextColor={'#bfbec5'}
                value={search}
                onChangeText={(text) => {
                  setSearch(text);
                }}
              />
            </View>

            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                }}
                style={styles.clearBtn}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>



          {isFetching && !isFetchingNextPage && !data ? (
              <LibraryGridSkeleton />
            ) : books.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={sortedData}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({item})=> <CardUI item={item} onPress={handleBookPress}/>}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-around' }}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#54408C']} />}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <PaginationSkeleton />
                  ) : null
                }
              />
            )}

          {selectedBook && isModalVisible && (
            <BottomModal book={selectedBook} visible={isModalVisible} onClose={()=> setIsModalVisible(false)}/>
          )}
          <BottomSheetFilter visible={isopen} onClose={()=> setIsOpen(false)} onCategorySelect={handleCategorySelection} onSortAZ={handleSortAZ}/>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
};

export default Library;

const styles = StyleSheet.create({
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
  container: {
      flex: 1,
      padding: 16,
      backgroundColor:'#fff',
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearBtn: {
      backgroundColor: '#f44336',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignSelf: 'center',
  },
  clearText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    // marginBottom: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  price: {
    marginTop: 4,
    fontSize: 12,
    color: '#444',
  },
  list: {
    paddingBottom: 100,
    width: screenWidth-32, // Adjusted for padding
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 20,
    width: '100%',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});