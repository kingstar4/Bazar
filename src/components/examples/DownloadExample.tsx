import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Switch } from 'react-native';
import { downloadFile, downloadAndOpenFile } from '../../hooks/handleDownload';
import { Book } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

interface DownloadExampleProps {
  book: Book;
}

const DownloadExample: React.FC<DownloadExampleProps> = ({ book }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [useAppStorage, setUseAppStorage] = useState(false);
  
  // Get download URLs from the book object
  const pdfUrl = book.accessInfo?.pdf?.downloadLink;
  const epubUrl = book.accessInfo?.epub?.downloadLink;
  
  // Check if downloads are available
  const isPdfAvailable = book.accessInfo?.pdf?.isAvailable && pdfUrl;
  const isEpubAvailable = book.accessInfo?.epub?.isAvailable && epubUrl;
  
  // Get book title for filename
  const title = book.volumeInfo.title;
  
  // Handle PDF download
  const handlePdfDownload = async () => {
    if (!pdfUrl) {
      Toast.show({
        type: 'error',
        text1: 'PDF Not Available',
        text2: 'This book does not have a PDF download link',
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Download the PDF file to the downloads folder or app storage based on user preference
      await downloadFile(pdfUrl, `${title} - PDF`, undefined, useAppStorage);
      
      // Toast notification is handled in the downloadFile function
    } catch (error) {
      console.error('PDF download error:', error);
      // Error handling is done in the downloadFile function
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle EPUB download
  const handleEpubDownload = async () => {
    if (!epubUrl) {
      Toast.show({
        type: 'error',
        text1: 'EPUB Not Available',
        text2: 'This book does not have an EPUB download link',
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Download the EPUB file to the downloads folder or app storage based on user preference
      await downloadFile(epubUrl, `${title} - EPUB`, undefined, useAppStorage);
      
      // Toast notification is handled in the downloadFile function
    } catch (error) {
      console.error('EPUB download error:', error);
      // Error handling is done in the downloadFile function
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle download and open
  const handleDownloadAndOpen = async (url: string, format: string) => {
    if (!url) {
      Toast.show({
        type: 'error',
        text1: `${format} Not Available`,
        text2: `This book does not have a ${format} download link`,
      });
      return;
    }

    try {
      setIsDownloading(true);

      // Download and open the file (always uses app storage for better compatibility)
      await downloadAndOpenFile(url, `${title} - ${format}`, true);
    } catch (error) {
      console.error(`${format} download and open error:`, error);
      // Error handling is done in the downloadAndOpenFile function
    } finally {
      setIsDownloading(false);
    }
  };
  // Show storage location info
  const showStorageInfo = () => {
    Alert.alert(
      'Storage Location',
      useAppStorage 
        ? 'Files will be saved within the app\'s private storage. These files are only accessible within the app but don\'t require storage permissions.'
        : 'Files will be saved to your device\'s Downloads folder when storage permissions are granted. If permissions are denied, files will automatically be saved to app storage instead.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Download Options</Text>
        <TouchableOpacity onPress={showStorageInfo} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#54408C" />
        </TouchableOpacity>
      </View>

      <View style={styles.storageToggle}>
        <Text style={styles.storageText}>Use App Storage</Text>
        <Switch
          value={useAppStorage}
          onValueChange={setUseAppStorage}
          trackColor={{ false: '#767577', true: '#54408C' }}
          thumbColor={useAppStorage ? '#f4f3f4' : '#f4f3f4'}
        />
        <Text style={styles.storageHint}>
          {useAppStorage ? 'App Only' : 'Downloads Folder'}
        </Text>
      </View>
      
      {/* PDF Download Button */}
      <TouchableOpacity
        style={[styles.button, !isPdfAvailable && styles.disabledButton]}
        onPress={handlePdfDownload}
        disabled={!isPdfAvailable || isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="document-text" size={20} color="#fff" />
            <Text style={styles.buttonText}>Download PDF</Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* EPUB Download Button */}
      <TouchableOpacity
        style={[styles.button, !isEpubAvailable && styles.disabledButton]}
        onPress={handleEpubDownload}
        disabled={!isEpubAvailable || isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="book" size={20} color="#fff" />
            <Text style={styles.buttonText}>Download EPUB</Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* Download and Open PDF Button */}
      <TouchableOpacity
        style={[styles.button, styles.openButton, !isPdfAvailable && styles.disabledButton]}
        onPress={() => handleDownloadAndOpen(pdfUrl!, 'PDF')}
        disabled={!isPdfAvailable || isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="open" size={20} color="#fff" />
            <Text style={styles.buttonText}>Download & Open PDF</Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* Download and Open EPUB Button */}
      <TouchableOpacity
        style={[styles.button, styles.openButton, !isEpubAvailable && styles.disabledButton]}
        onPress={() => handleDownloadAndOpen(epubUrl!, 'EPUB')}
        disabled={!isEpubAvailable || isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="open" size={20} color="#fff" />
            <Text style={styles.buttonText}>Download & Open EPUB</Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* Status Message */}
      {!isPdfAvailable && !isEpubAvailable && (
        <Text style={styles.unavailableText}>
          No downloadable formats available for this book
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    padding: 4,
  },
  storageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  storageText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  storageHint: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    width: 100,
  },
  button: {
    backgroundColor: '#54408C',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  openButton: {
    backgroundColor: '#2E7D32',
  },
  disabledButton: {
    backgroundColor: '#9e9e9e',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  unavailableText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DownloadExample;