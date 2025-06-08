/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book } from '../../../navigation/types';
import { fetchBooks } from '../../../api/bookApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import BottomModal from '../../customUI/BottomModal';
import { getColorFromId} from '../../../hooks/getColorFromID';
import BottomSheetFilter from '../../customUI/BottomSheetFilter';

type Props = {}


const Category = ({}: Props) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('fiction');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [sortAZ, setSortAZ] = useState(false);

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

  const handleBookPress = (book: Book) => {
      setSelectedBook(book);
      setIsModalVisible(true);
  };

  // Use debounced search term for the query
  const activeQuery = debouncedSearch ? debouncedSearch : `subject:${selectedCategory}`;

  const { data = [], isFetching, error, isError } = useQuery<Book[], Error>({
      queryKey: ['books', activeQuery],
      queryFn: () => fetchBooks(activeQuery),
      staleTime: 1000 * 60 * 5, // 5 minutes cache

  });

  // Component carrying book card details
  const renderBook = ({ item}: { item: Book }) => {
      const { title } = item.volumeInfo;
      const sale = item.saleInfo;
      const imageUrl = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/135x150';

      const getPriceText = () => {
      if (sale?.saleability === 'FOR_SALE') {
        if (sale?.retailPrice) {
          return `${sale?.retailPrice.amount.toFixed(2)} ${sale?.retailPrice.currencyCode}`;
        } else if (sale?.listPrice) {
          return `${sale?.listPrice.amount.toFixed(2)} ${sale?.listPrice.currencyCode}`;
        }
      }
      return sale?.saleability === 'FREE' ? 'Free' : 'Not for Sale';
    };

      return (
          <View style={styles.bookList}>
            <Pressable onPress={()=>handleBookPress(item)} style={{alignItems:'center', justifyContent:'center'}}>
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

              <View style={{paddingHorizontal: 8, paddingVertical: 4, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'transparent'}}>
                <Text style={{textAlign:'center', fontWeight:700}} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={{textAlign:'center'}} numberOfLines={1}>
                  {getPriceText()}
                </Text>
              </View>
          </Pressable>
      </View>
      );
    };

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

    const sortedData = useMemo(()=>{
      if (!sortAZ) {return data;}
      return [...data].sort((a,b) => {
        const titleA = a.volumeInfo.title.toUpperCase();
        const titleB = b.volumeInfo.title.toUpperCase();
        return titleA.localeCompare(titleB);
    });
    },[data, sortAZ]);

    return (
      <View style={styles.container}>

        <View style={styles.row}>
          <Text style={styles.headerTitle}>Categories</Text>

          <TouchableOpacity onPress={()=> setIsOpen(true)} style={{padding: 8, borderRadius: 8, backgroundColor: '#f5f5f5', elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1}}>
            <Ionicons name="filter" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books..."
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



        {isFetching ? (
          <ActivityIndicator size="large" color="#333" style={{ marginVertical: 20 }} />
        ) : !data.length ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={sortedData}
            keyExtractor={(item) => item.id}
            renderItem={renderBook}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
        {selectedBook && isModalVisible && (
          <BottomModal book={selectedBook} visible={isModalVisible} onClose={()=> setIsModalVisible(false)}/>
        )}
        <BottomSheetFilter visible={isopen} onClose={()=> setIsOpen(false)} onCategorySelect={handleCategorySelection} onSortAZ={handleSortAZ}/>
      </View>
    );
};

export default Category;

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
      marginTop: 40,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
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
    marginBottom: 16,
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
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      borderWidth: 0,
      paddingHorizontal: 12,
      flex: 1,
      marginRight: 10,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.1,
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