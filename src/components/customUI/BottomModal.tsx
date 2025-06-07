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
import { Book } from '../../navigation/types';
import FastImage from 'react-native-fast-image';
import CusButton from './CusButton';
import { downloadFile, downloadAndOpenFile } from '../../hooks/handleDownload';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';


type Props = {
  onClose: () => void;
  book: Book | null;
  visible: boolean;
}

const BottomModal = ({onClose, book, visible}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [ '60%', '100%'], []);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Open Bottom sheet Modal when visible becomes true
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Render backdrop component
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

  if (!book) {
    return null;
  }

  const { title, description, imageLinks, authors } = book.volumeInfo;
  const price = book.saleInfo?.saleability === 'FOR_SALE'
    ? `${book.saleInfo?.retailPrice?.amount} ${book.saleInfo?.retailPrice?.currencyCode}`
    : book.saleInfo?.saleability === 'FREE'
    ? 'Free'
    : 'Not for sale';
  const epubUrl = book.accessInfo?.epub?.downloadLink;
  const pdfUrl = book.accessInfo?.pdf?.downloadLink;
  const downloadUrl = epubUrl || pdfUrl;
  
  // Check if downloads are available
  const isPdfAvailable = book.accessInfo?.pdf?.isAvailable && pdfUrl;
  const isEpubAvailable = book.accessInfo?.epub?.isAvailable && epubUrl;


  const handleReadOnline = () => {
    if (book.accessInfo?.webReaderLink) {
      Linking.openURL(book.accessInfo.webReaderLink);
    } else {
      Alert.alert('Read Online not available', 'This book is not available for online reading.');
    }
  };

  return (
    <BottomSheet
      handleIndicatorStyle={{backgroundColor:'#ddd', width: 60, height: 5}}
      handleStyle={styles.handleStyle}
      backgroundStyle={styles.sheetBackground}
      snapPoints={snapPoints}
      index={1}
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
              <View style={styles.imgContainer}>
                <FastImage
                  source={{
                    uri: imageLinks?.thumbnail || 'https://via.placeholder.com/135x150',
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

                {/* Move favorite button to the image container */}
                <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isFavorite ? '#FF6B6B' : '#fff'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.bookInfoContainer}>
                <Text style={styles.bookTitle}>{title}</Text>
                <Text style={styles.authorText}>by {authors?.join(', ') || 'Unknown Author'}</Text>

                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= (book.volumeInfo.averageRating || 4) ? 'star' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                      style={{marginRight: 2}}
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    {book.volumeInfo.averageRating || '4.0'}
                    <Text style={styles.ratingCount}>
                      ({book.volumeInfo.ratingsCount || '120'} reviews)
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>{price}</Text>
            </View>

            {book.volumeInfo.categories && (
              <View style={styles.categoriesContainer}>
                {book.volumeInfo.categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Book Description</Text>
              <Text style={styles.descriptionText}>{description || 'No description available.'}</Text>
            </View>

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

            <View style={styles.actionButtonsContainer}>
              {/* Single Download Button with all options */}
              <CusButton
                onPress={async () => {
                  if (!downloadUrl) {
                    Alert.alert('Download not available', 'This book is not available for download.');
                    return;
                  }

                  // Show options in a single alert dialog
                  Alert.alert(
                    'Download Options',
                    'Choose an action',
                    [
                      // Download option
                      {
                        text: 'Download',
                        onPress: async () => {
                          try {
                            // If both formats are available, show a choice dialog
                            if (isPdfAvailable && isEpubAvailable) {
                              Alert.alert(
                                'Choose Format',
                                'Which format would you like to download?',
                                [
                                  {
                                    text: 'PDF',
                                    onPress: async () => {
                                      try {
                                        await downloadFile(pdfUrl!, title);
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
                                        await downloadFile(epubUrl!, title);
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
                                  {
                                    text: 'Cancel',
                                    style: 'cancel',
                                  },
                                ]
                              );
                            } else {
                              // Only one format is available, download it directly
                              await downloadFile(downloadUrl, title);
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
                      // Download & Open option
                      {
                        text: 'Download & Open',
                        onPress: async () => {
                          try {
                            if (isPdfAvailable && isEpubAvailable) {
                              Alert.alert(
                                'Choose Format',
                                'Which format would you like to download and open?',
                                [
                                  {
                                    text: 'PDF',
                                    onPress: () => downloadAndOpenFile(pdfUrl!, title),
                                  },
                                  {
                                    text: 'EPUB',
                                    onPress: () => downloadAndOpenFile(epubUrl!, title),
                                  },
                                  {
                                    text: 'Cancel',
                                    style: 'cancel',
                                  },
                                ]
                              );
                            } else {
                              await downloadAndOpenFile(downloadUrl, title);
                            }
                          } catch (error) {
                            // Error handling is done in the downloadAndOpenFile function
                          }
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                    ]
                  );
                }}
                text="Download"
                Icon={<Ionicons name="cloud-download" size={20} color="#fff"/>}
                buttonStyle={[styles.downloadButton, !downloadUrl && { opacity: 0.6 }]}
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

export default BottomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20, // Add padding to the top to avoid content being hidden by the close button
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
    marginTop: 10, // Add margin to the top to avoid content being hidden by the close button
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
    justifyContent:'center',
    alignItems: 'center',
    // justifyContent: 'space-between',
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