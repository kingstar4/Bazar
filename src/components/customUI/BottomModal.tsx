/* eslint-disable react-native/no-inline-styles */
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Book } from '../../navigation/types';
import FastImage from 'react-native-fast-image';
import CusButton from './CusButton';
import { downloadFile } from '../../hooks/handleDownload';


type Props = {
  onClose: () => void;
  book: Book | null;
  visible: boolean;

}

const BottomModal = ({onClose, book, visible}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [ '60%', '100%'], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);



  // Open Bottom sheet Modal when visible becomes true
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!book) {
    return null;
  }

  const { title, description, imageLinks, authors } = book.volumeInfo;
  const price = book.saleInfo?.saleability === 'FOR_SALE'
    ? `${book.saleInfo?.retailPrice?.amount} ${book.saleInfo?.retailPrice?.currencyCode}`
    : book.saleInfo?.saleability === 'FREE'
    ? 'Free'
    : 'Not for sale';
  const downloadUrl = book.accessInfo?.epub?.downloadLink || book.accessInfo?.pdf?.downloadLink;


  const handleReadOnline = () => {
    if (book.accessInfo?.webReaderLink) {
      Linking.openURL(book.accessInfo.webReaderLink);
    } else {
      Alert.alert('Read Online not available', 'This book is not available for online reading.');
    }
  };

  return (
    <BottomSheet handleIndicatorStyle={{backgroundColor:'#ddd', elevation:4}} snapPoints={snapPoints} index= {1} ref={bottomSheetRef} enablePanDownToClose={true} onClose={handleClose}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <View>
            <View style={styles.img}>
              <FastImage
                    source={{
                      uri: imageLinks?.thumbnail || 'https://via.placeholder.com/135x150',
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={{width:135, height:150, borderRadius:20}}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <View style={{alignSelf:'center', paddingVertical:10}}>
              <Text style={{fontWeight: '400', fontSize: 25, textAlign:'center'}}>{title}</Text>
              <Text style={{textAlign:'center'}}>by {authors}</Text>

              {/* <Ionicons name="heart" size={20} color="#54408C"/> */}
            </View>
            <View style={{flexDirection:'row', paddingVertical:10}}>
              <Text style={{fontWeight:'500', fontSize:20}}>Price: </Text>
              <Text style={{fontSize:20}}>{price}</Text>
            </View>
            <View>
              <Text style={{fontWeight:'700', fontSize:20, paddingVertical:20}}>Book Description</Text>
              <Text>{description}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical:20}}>
              <CusButton
                 onPress={async () => {
                    if (downloadUrl) {
                      try {
                        await downloadFile(downloadUrl, title);
                        Alert.alert('Success', 'Book downloaded successfully');
                      } catch (error) {
                        Alert.alert('Download failed', 'There was an error downloading the book');
                      }
                    } else {
                      Alert.alert('Download not available', 'This book is not available for download.');
                    }
                  }}
                text="Download"
                Icon={<Ionicons name="cloud-download" size={20} color="#fff"/>}
                buttonStyle={styles.btn}
              />
              <CusButton onPress={handleReadOnline} text="Read Online" Icon={<FontAwesome5 name="book-reader" size={15} color="#fff"/>} buttonStyle={styles.btn} />
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 40,
  },
  img:{
    display: 'flex',
    paddingVertical: 20,
    justifyContent: 'center',
    flexDirection: 'column',
    width: 135,
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
  },
  btn:{
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});