/* eslint-disable react-native/no-inline-styles */
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert, Linking, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Book } from '../../utils/types';
import FastImage from 'react-native-fast-image';
import CusButton from './CusButton';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useAppStore } from '../../store/useAppStore';

// Lazy load the download functions to avoid blocking the initial render
const downloadFunctions = {
  downloadFile: null as any,
  downloadAndOpenFile: null as any,
};

const loadDownloadFunctions = async () => {
  if (!downloadFunctions.downloadFile) {
    const { downloadFile, downloadAndOpenFile } = await import('../../hooks/handleDownload');
    downloadFunctions.downloadFile = downloadFile;
    downloadFunctions.downloadAndOpenFile = downloadAndOpenFile;
  }
  return downloadFunctions;
};

type Props = {
  onClose: () => void;
  book: Book | null;
  visible: boolean;
}

// Memoized components for better performance
const BookImage = React.memo(({ imageUri, isFavorite, onToggleFavorite }: {
  imageUri: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => (
  <View style={styles.imgContainer}>
    <FastImage
      source={{
        uri: imageUri || 'https://via.placeholder.com/135x150',
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }}
      style={styles.bookImage}
      resizeMode={FastImage.resizeMode.cover}
    />
    <LinearGradient
      colors={['rgba(84, 64, 140, 0.8)', 'rgba(84, 64, 140, 0.4)']}
      style={styles.imageOverlay}
    />
    <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={isFavorite ? '#FF6B6B' : '#fff'}
      />
    </TouchableOpacity>
  </View>
));

const BookInfo = React.memo(({ title, authors, rating, ratingsCount }: {
  title: string;
  authors?: string[];
  rating?: number;
  ratingsCount?: number;
}) => (
  <View style={styles.bookInfoContainer}>
    <Text style={styles.bookTitle}>{title}</Text>
    <Text style={styles.authorText}>by {authors?.join(', ') || 'Unknown Author'}</Text>
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= (rating || 4) ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
          style={{marginRight: 2}}
        />
      ))}
      <Text style={styles.ratingText}>
        {rating || '4.0'}
        <Text style={styles.ratingCount}>
          ({ratingsCount || '120'} reviews)
        </Text>
      </Text>
    </View>
  </View>
));

const CategoryTags = React.memo(({ categories }: { categories?: string[] }) => {
  if (!categories) return null;
  
  return (
    <View style={styles.categoriesContainer}>
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryTag}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      ))}
    </View>
  );
});

const BookDetails = React.memo(({ book }: { book: Book }) => (
  <View style={styles.detailsSection}>
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Publisher:</Text>
      <Text style={styles.detailValue}>{book.volumeInfo.publisher || 'Unknown'}</Text>
    </View>
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Published:</Text>
      <Text style={styles.detailValue}>{book.volumeInfo.publishedDate || 'Unknown'}</Text>
    </View>
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Pages:</Text>
      <Text style={styles.detailValue}>{book.volumeInfo.pageCount || 'Unknown'}</Text>
    </View>
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Language:</Text>
      <Text style={styles.detailValue}>{book.volumeInfo.language?.toUpperCase() || 'Unknown'}</Text>
    </View>
  </View>
));

const BottomModal = ({ onClose, book, visible }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%', '100%'], []);
  
  // Zustand selectors - memoized for performance
  const addFavourite = useAppStore(useCallback((state) => state.addFavourite, []));
  const removeFavourite = useAppStore(useCallback((state) => state.removeFavourite, []));
  const isBookFavourite = useAppStore(useCallback((state) => state.isBookFavourite, []));

  const [isFavorite, setIsFavorite] = useState(false);

  // Memoized book data to avoid recalculations
  const bookData = useMemo(() => {
    if (!book) return null;
    
    const { title, description, imageLinks, authors } = book.volumeInfo;
    const price = book.saleInfo?.saleability === 'FOR_SALE'
      ? `${book.saleInfo?.retailPrice?.amount} ${book.saleInfo?.retailPrice?.currencyCode}`
      : book.saleInfo?.saleability === 'FREE'
      ? 'Free'
      : 'Not for sale';
    
    const epubUrl = book.accessInfo?.epub?.downloadLink;
    const pdfUrl = book.accessInfo?.pdf?.downloadLink;
    const downloadUrl = epubUrl || pdfUrl;
    
    const isPdfAvailable = book.accessInfo?.pdf?.isAvailable && pdfUrl;
    const isEpubAvailable = book.accessInfo?.epub?.isAvailable && epubUrl;
    
    return {
      title,
      description,
      imageUri: imageLinks?.thumbnail,
      authors,
      price,
      epubUrl,
      pdfUrl,
      downloadUrl,
      isPdfAvailable,
      isEpubAvailable,
      rating: book.volumeInfo.averageRating,
      ratingsCount: book.volumeInfo.ratingsCount,
      categories: book.volumeInfo.categories,
      webReaderLink: book.accessInfo?.webReaderLink,
    };
  }, [book]);

  // Update favorite status when book changes
  useEffect(() => {
    if (book) {
      setIsFavorite(isBookFavourite(book.id));
    }
  }, [book, isBookFavourite]);

  // Memoized handlers
  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  const toggleFavorite = useCallback(() => {
    if (!book) return;
    
    if (isFavorite) {
      removeFavourite(book.id);
      setIsFavorite(false);
    } else {
      addFavourite({ ...book, isFavourite: true });
      setIsFavorite(true);
    }
  }, [book, isFavorite, addFavourite, removeFavourite]);

  const handleReadOnline = useCallback(() => {
    if (bookData?.webReaderLink) {
      Linking.openURL(bookData.webReaderLink);
    } else {
      Alert.alert('Read Online not available', 'This book is not available for online reading.');
    }
  }, [bookData?.webReaderLink]);

  const handleDownload = useCallback(async () => {
    if (!bookData?.downloadUrl || !book) {
      Alert.alert('Download not available', 'This book is not available for download.');
      return;
    }

    // Load download functions lazily
    const { downloadFile, downloadAndOpenFile } = await loadDownloadFunctions();

    Alert.alert(
      'Download Options',
      'Choose an action',
      [
        {
          text: 'Download',
          onPress: async () => {
            try {
              if (bookData.isPdfAvailable && bookData.isEpubAvailable) {
                Alert.alert(
                  'Choose Format',
                  'Which format would you like to download?',
                  [
                    {
                      text: 'PDF',
                      onPress: async () => {
                        try {
                          await downloadFile(bookData.pdfUrl!, bookData.title);
                          Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'PDF downloaded successfully',
                          });
                        } catch (error) {
                          // Error handling is done in the downloadFile function
                        }
                      },
                    },
                    {
                      text: 'EPUB',
                      onPress: async () => {
                        try {
                          await downloadFile(bookData.epubUrl!, bookData.title);
                          Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'EPUB downloaded successfully',
                          });
                        } catch (error) {
                          // Error handling is done in the downloadFile function
                        }
                      },
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              } else {
                await downloadFile(bookData.downloadUrl, bookData.title);
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Book downloaded successfully',
                });
              }
            } catch (error) {
              // Error handling is done in the downloadFile function
            }
          },
        },
        {
          text: 'Download & Open',
          onPress: async () => {
            try {
              if (bookData.isPdfAvailable && bookData.isEpubAvailable) {
                Alert.alert(
                  'Choose Format',
                  'Which format would you like to download and open?',
                  [
                    {
                      text: 'PDF',
                      onPress: () => downloadAndOpenFile(bookData.pdfUrl!, bookData.title),
                    },
                    {
                      text: 'EPUB',
                      onPress: () => downloadAndOpenFile(bookData.epubUrl!, bookData.title),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              } else {
                await downloadAndOpenFile(bookData.downloadUrl, bookData.title);
              }
            } catch (error) {
              // Error handling is done in the downloadAndOpenFile function
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [bookData, book]);

  // Control bottom sheet visibility
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Memoized backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  if (!book || !bookData) {
    return null;
  }

  return (
    <BottomSheet
      handleIndicatorStyle={{backgroundColor:'#ddd', width: 40, height: 4}}
      handleStyle={styles.handleStyle}
      backgroundStyle={styles.sheetBackground}
      snapPoints={snapPoints}
      index={-1}
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      onClose={handleClose}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#54408C" />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <BookImage
                imageUri={bookData.imageUri}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
              <BookInfo
                title={bookData.title}
                authors={bookData.authors}
                rating={bookData.rating}
                ratingsCount={bookData.ratingsCount}
              />
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>{bookData.price}</Text>
            </View>

            <CategoryTags categories={bookData.categories} />

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Book Description</Text>
              <Text style={styles.descriptionText}>
                {bookData.description || 'No description available.'}
              </Text>
            </View>

            <BookDetails book={book} />

            <View style={styles.actionButtonsContainer}>
              <CusButton
                onPress={handleDownload}
                text="Download"
                Icon={<Ionicons name="cloud-download" size={20} color="#fff"/>}
                buttonStyle={[styles.downloadButton, !bookData.downloadUrl && { opacity: 0.6 }]}
              />
              <CusButton
                onPress={handleReadOnline}
                text="Read Online"
                Icon={<FontAwesome5 name="book-reader" size={15} color="#fff"/>}
                buttonStyle={styles.readButton}
              />
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default React.memo(BottomModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  contentContainer: {
    padding: 20,
  },
  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleStyle: {
    paddingTop: 12,
    paddingBottom: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 16,
    top: 8,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 10,
  },
  imgContainer: {
    position: 'relative',
    width: 120,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bookInfoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  bookTitle: {
    fontWeight: '600',
    fontSize: 20,
    color: '#333',
    marginBottom: 4,
    lineHeight: 25,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  priceLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 16,
    color: '#54408C',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryTag: {
    backgroundColor: 'rgba(84, 64, 140, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#54408C',
    fontSize: 12,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  detailsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#54408C',
    borderRadius: 12,
    height: 48,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  readButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#54408C',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
});