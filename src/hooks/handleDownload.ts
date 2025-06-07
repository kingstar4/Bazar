import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * Check if we have storage permissions
 * @returns Promise resolving to a boolean indicating if we have permissions
 */
const checkStoragePermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true; // iOS doesn't need runtime permissions for this
  }

  try {
    // For Android 13+ (API 33+)
    if (Platform.Version >= 33) {
      const hasReadMediaImages = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      const hasReadMediaVideo = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
      );
      const hasReadMediaAudio = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
      );

      return hasReadMediaImages && hasReadMediaVideo && hasReadMediaAudio;
    }
    // For Android 10-12 (API 29-32)
    else if (Platform.Version >= 29) {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
    } 
    // For Android 9 and below (API <= 28)
    else {
      const hasWriteStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      const hasReadStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      return hasWriteStorage && hasReadStorage;
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

/**
 * Request storage permissions for Android
 * @returns boolean indicating if permissions were granted
 */
const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true; // iOS doesn't need runtime permissions for this
  }

  // First check if we already have permissions
  const hasPermissions = await checkStoragePermissions();
  if (hasPermissions) {
    return true;
  }

  try {
    // For Android 13+ (API 33+)
    if (Platform.Version >= 33) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);

      // Check if all required permissions are granted
      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.warn('Some media permissions were denied on Android 13+');
      }

      return allGranted;
    }
    // For Android 10-12 (API 29-32)
    else if (Platform.Version >= 29) {
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

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Storage permission denied on Android 10-12');
      }

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // For Android 9 and below (API <= 28)
    else {
      const writeGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Bazar needs access to your storage to download books.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      const readGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Bazar needs access to your storage to download books.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      const allGranted =
        writeGranted === PermissionsAndroid.RESULTS.GRANTED && 
        readGranted === PermissionsAndroid.RESULTS.GRANTED;

      if (!allGranted) {
        console.warn('Some storage permissions were denied on Android 9 or below');
      }

      return allGranted;
    }
  } catch (err) {
    console.error('Error requesting permissions:', err);
    return false;
  }
};

/**
 * Get the appropriate download directory based on platform and permissions
 * @param useExternalStorage Whether to try using external storage (requires permissions)
 * @returns Path to the download directory
 */
const getDownloadDirectory = async (useExternalStorage: boolean = true): Promise<string> => {
  // For iOS, always use the app's document directory
  if (Platform.OS !== 'android') {
    return RNFS.DocumentDirectoryPath;
  }

  // For Android, check if we have permissions for external storage
  if (useExternalStorage) {
    const hasPermission = await checkStoragePermissions();
    if (hasPermission) {
      // Use the system's Download directory if we have permission
      return RNFS.DownloadDirectoryPath;
    }
  }

  // Fallback to app-specific storage (doesn't require permissions)
  console.log('Using app-specific storage for downloads');
  return `${RNFS.DocumentDirectoryPath}/downloads`;
};

/**
 * Download a file from a URL to the device's storage
 * @param url URL of the file to download
 * @param fileName Name to save the file as (without extension)
 * @param customPath Optional custom path to save the file to
 * @param forceAppStorage Force using app-specific storage even if permissions are available
 * @returns Promise resolving to the path where the file was saved
 */
export const downloadFile = async (
  url: string, 
  fileName: string, 
  customPath?: string,
  forceAppStorage: boolean = false
): Promise<string> => {
  try {
    // Determine file extension from URL
    const fileExtension = url.toLowerCase().endsWith('.pdf') 
      ? '.pdf' 
      : url.toLowerCase().endsWith('.epub') 
        ? '.epub' 
        : url.includes('pdf') 
          ? '.pdf' 
          : '.epub';

    // Clean the filename to avoid invalid characters
    const sanitizedFileName = fileName
      .replace(/[/\\?%*:|"<>]/g, '-')
      .trim();

    const fullFileName = `${sanitizedFileName}${fileExtension}`;

    // Determine download destination
    let downloadDest: string;
    let useExternalStorage = !forceAppStorage;

    // Request permissions if trying to use external storage
    if (useExternalStorage && Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.log('Storage permissions denied, falling back to app storage');
        useExternalStorage = false;

        // Show a toast to inform the user
        Toast.show({
          type: 'info',
          text1: 'Using App Storage',
          text2: 'Files will be saved within the app since storage permissions were denied',
          visibilityTime: 4000,
        });
      }
    }

    if (customPath) {
      // Use custom path if provided
      downloadDest = `${customPath}/${fullFileName}`;
    } else {
      // Get appropriate download directory based on permissions
      const downloadDir = await getDownloadDirectory(useExternalStorage);

      // Ensure the directory exists
      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }

      downloadDest = `${downloadDir}/${fullFileName}`;
    }

    // Check if file already exists
    const fileExists = await RNFS.exists(downloadDest);
    if (fileExists) {
      // Ask user if they want to overwrite
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
                  const path = await performDownload(url, downloadDest, fileExtension);
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
    return await performDownload(url, downloadDest, fileExtension);

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
 * Perform the actual download operation
 * @param url URL to download from
 * @param destination Path to save the file to
 * @param fileExtension File extension (.pdf or .epub)
 * @returns Promise resolving to the path where the file was saved
 */
const performDownload = async (
  url: string,
  destination: string,
  fileExtension: string
): Promise<string> => {
  // Show download started toast
  Toast.show({
    type: 'info',
    text1: 'Download Started',
    text2: 'Your book is being downloaded...',
  });

  // Start the download
  const result = await RNFS.downloadFile({
    fromUrl: url,
    toFile: destination,
    background: true, // Allow download to continue in background
    discretionary: true, // Allow the OS to control the timing and speed
    progressDivider: 10, // Report progress in 10% increments
    progress: (res) => {
      const progress = res.bytesWritten / res.contentLength;
      console.log(`Download progress: ${Math.round(progress * 100)}%`);
    },
  }).promise;
  // Check if download was successful
  if (result.statusCode !== 200 && result.statusCode !== 206) {
    throw new Error(`Download failed with status code: ${result.statusCode}`);
  }

  // Show success toast
  Toast.show({
    type: 'success',
    text1: 'Download Complete',
    text2: 'Your book has been downloaded successfully',
  });

  console.log('Downloaded to:', destination);

  return destination;
};

/**
 * Download and open a file
 * @param url URL of the file to download
 * @param fileName Name to save the file as (without extension)
 * @param forceAppStorage Force using app-specific storage even if permissions are available
 */
export const downloadAndOpenFile = async (
  url: string,
  fileName: string,
  forceAppStorage: boolean = false
): Promise<void> => {
  try {
    // Always use app storage for files that will be opened immediately
    // This ensures we can access the file without storage permission issues
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
        // Open the file with the appropriate app
        await Share.open({
          url: `file://${filePath}`,
          type: filePath.endsWith('.pdf') ? 'application/pdf' : 'application/epub+zip',
        });
      } catch (shareError) {
        console.error('Error opening file with Share:', shareError);

        // If Share fails, try to provide helpful information
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
      exists: stats.exists,
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