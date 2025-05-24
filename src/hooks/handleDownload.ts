import RNFS from 'react-native-fs';
import Share from 'react-native-share'; // optional

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const fileExtension = url.toLowerCase().endsWith('.pdf') ? '.pdf' : '.epub';
    const fullFileName = `${fileName}${fileExtension}`;

    // Use DocumentDirectoryPath (safe and accessible by user on both platforms)
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${fullFileName}`;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadDest,
    }).promise;

    if (result.statusCode !== 200) {
      throw new Error('Download failed');
    }

    console.log('Downloaded to:', downloadDest);

    // Optionally share or open the file
    await Share.open({
      url: `file://${downloadDest}`,
      type: fileExtension === '.pdf' ? 'application/pdf' : 'application/epub+zip',
    });

  } catch (error) {
    console.error('Error downloading or sharing file:', error);
  }
};
