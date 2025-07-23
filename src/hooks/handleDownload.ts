import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * Validate input parameters
 */
const validateInputs = (url: string, fileName: string): void => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error('Invalid URL provided');
  }
  if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
    throw new Error('Invalid filename provided');
  }
};

/**
 * Get file extension from URL with better validation
 */
const getFileExtension = (url: string): string => {
  try {
    const urlLower = url.toLowerCase();

    // Check for explicit file extensions
    if (urlLower.includes('.pdf')) {return '.pdf';}
    if (urlLower.includes('.epub')) {return '.epub';}

    // Default to PDF for books
    return '.pdf';
  } catch (error) {
    console.warn('Error determining file extension, defaulting to PDF:', error);
    return '.pdf';
  }
};

/**
 * Sanitize filename to remove invalid characters
 */
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100); // Limit length
};

/**
 * Request storage permissions (simplified)
 */
const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'Bazar needs access to your storage to download books.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

/**
 * Get download directory (simplified)
 */
const getDownloadDirectory = async (): Promise<string> => {
  if (Platform.OS === 'ios') {
    return RNFS.DocumentDirectoryPath;
  }

  // Try to use Downloads folder, fallback to app directory
  try {
    const hasPermission = await requestStoragePermission();
    if (hasPermission) {
      return RNFS.DownloadDirectoryPath;
    }
  } catch (error) {
    console.log('Permission denied, using app storage');
  }

  // Fallback to app directory
  const appDownloadDir = `${RNFS.DocumentDirectoryPath}/downloads`;
  const dirExists = await RNFS.exists(appDownloadDir);
  if (!dirExists) {
    await RNFS.mkdir(appDownloadDir);
  }
  return appDownloadDir;
};

/**
 * Download a file from a URL to the device's storage (simplified)
 * @param url URL of the file to download
 * @param fileName Name to save the file as (without extension)
 * @param customPath Optional custom path to save the file to
 * @param forceAppStorage Force using app-specific storage
 * @returns Promise resolving to the path where the file was saved
 */
export const downloadFile = async (
  url: string,
  fileName: string,
  customPath?: string,
  forceAppStorage: boolean = false
): Promise<string> => {
  try {
    // Validate inputs
    validateInputs(url, fileName);

    // Get file extension and sanitize filename
    const fileExtension = getFileExtension(url);
    const sanitizedFileName = sanitizeFileName(fileName);
    const fullFileName = `${sanitizedFileName}${fileExtension}`;

    // Determine download destination
    let downloadDest: string;

    if (customPath) {
      downloadDest = `${customPath}/${fullFileName}`;
    } else {
      const downloadDir = await getDownloadDirectory();
      downloadDest = `${downloadDir}/${fullFileName}`;
    }

    // Check if file already exists and handle overwrite
    const fileExists = await RNFS.exists(downloadDest);
    if (fileExists) {
      return new Promise((resolve, reject) => {
        Alert.alert(
          'File Already Exists',
          'A file with this name already exists. Do you want to replace it?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => reject(new Error('Download cancelled')),
            },
            {
              text: 'Replace',
              onPress: async () => {
                try {
                  const path = await performDownload(url, downloadDest);
                  resolve(path);
                } catch (error) {
                  reject(error);
                }
              },
            },
          ],
          { cancelable: true }
        );
      });
    }

    // Perform the download
    return await performDownload(url, downloadDest);

  } catch (error) {
    console.error('Error downloading file:', error);
    Toast.show({
      type: 'error',
      text1: 'Download Failed',
      text2: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    throw error;
  }
};

/**
 * Perform the actual download operation (simplified)
 * @param url URL to download from
 * @param destination Path to save the file to
 * @returns Promise resolving to the path where the file was saved
 */
const performDownload = async (
  url: string,
  destination: string
): Promise<string> => {
  try {
    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL format');
    }

    // Show download started toast
    Toast.show({
      type: 'info',
      text1: 'Download Started',
      text2: 'Your book is being downloaded...',
    });

    // Start the download with simplified options
    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destination,
      background: true,
      discretionary: true,
      progressDivider: 10,
      progress: (res) => {
        if (res.contentLength > 0) {
          const progress = res.bytesWritten / res.contentLength;
          console.log(`Download progress: ${Math.round(progress * 100)}%`);
        }
      },
    }).promise;

    // Check if download was successful
    if (result.statusCode !== 200 && result.statusCode !== 206) {
      throw new Error(`Download failed with status code: ${result.statusCode}`);
    }

    // Verify file was actually downloaded
    const fileExists = await RNFS.exists(destination);
    if (!fileExists) {
      throw new Error('File was not saved properly');
    }

    // Check file size
    const stats = await RNFS.stat(destination);
    if (stats.size === 0) {
      await RNFS.unlink(destination); // Remove empty file
      throw new Error('Downloaded file is empty');
    }

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Download Complete',
      text2: 'Your book has been downloaded successfully',
    });

    console.log('Downloaded to:', destination);
    return destination;

  } catch (error) {
    // Clean up failed download
    try {
      const fileExists = await RNFS.exists(destination);
      if (fileExists) {
        await RNFS.unlink(destination);
      }
    } catch (cleanupError) {
      console.warn('Failed to clean up incomplete download:', cleanupError);
    }

    throw error;
  }
};

/**
 * Download and open a file (simplified)
 * @param url URL of the file to download
 * @param fileName Name to save the file as (without extension)
 */
export const downloadAndOpenFile = async (
  url: string,
  fileName: string
): Promise<void> => {
  try {
    // Validate inputs first
    validateInputs(url, fileName);

    // Always use app storage for files that will be opened immediately
    const filePath = await downloadFile(url, fileName, undefined, true);

    // Show a toast before opening
    Toast.show({
      type: 'success',
      text1: 'Opening File',
      text2: 'The file has been downloaded and will open shortly',
      visibilityTime: 2000,
    });

    // Give the toast a moment to display before opening the file
    setTimeout(async () => {
      try {
        // Determine MIME type based on file extension
        const mimeType = filePath.endsWith('.pdf')
          ? 'application/pdf'
          : 'application/epub+zip';

        // Open the file with the appropriate app
        await Share.open({
          url: `file://${filePath}`,
          type: mimeType,
        });
      } catch (shareError) {
        console.error('Error opening file with Share:', shareError);

        Toast.show({
          type: 'error',
          text1: 'Cannot Open File',
          text2: 'You may need to install a PDF or EPUB reader app',
          visibilityTime: 4000,
        });
      }
    }, 500);

  } catch (error) {
    console.error('Error downloading or opening file:', error);

    // Only show error if it's not a user cancellation
    if (error instanceof Error && error.message !== 'Download cancelled') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to download or open the file',
      });
    }
  }
};

/**
 * Get file information including size, name, and path
 * @param filePath Path to the file
 * @returns Object containing file information
 */
export const getFileInfo = async (filePath: string) => {
  try {
    const stats = await RNFS.stat(filePath);
    return {
      exists: true,
      size: stats.size,
      name: filePath.split('/').pop(),
      path: filePath,
      isDirectory: stats.isDirectory(),
      lastModified: stats.mtime,
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};