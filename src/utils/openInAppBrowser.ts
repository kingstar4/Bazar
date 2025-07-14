import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Toast from 'react-native-toast-message';


export const openInAppBrowser = async (url: string) => {
    try {
        // Validate input
        if (!url ) {
            throw new Error('No URL provided');
        }

        let finalUrl = '';

        // To Handle Blog Post
        if (url && url.trim()) {
            // General sanitization
            if (url.startsWith('www.')) {
                finalUrl = `https://${url}`;
            } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                finalUrl = `https://${url}`;
            } else {
                finalUrl = url;
            }
        } else {
            throw new Error('Invalid URL provided');
        }

        // Additional URL validation
        if (!finalUrl || finalUrl.trim() === '') {
            throw new Error('Final URL is empty');
        }

        // Always use InAppBrowser for http/https links
        if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
            try {
                const isAvailable = await InAppBrowser.isAvailable();
                if (isAvailable) {
                    await InAppBrowser.open(finalUrl, {
                        dismissButtonStyle: 'close',
                        preferredBarTintColor: '#54408C',
                        preferredControlTintColor: 'white',
                        showTitle: true,
                        toolbarColor: '#54408C',
                        enableDefaultShare: true,
                        enableUrlBarHiding: true,
                        forceCloseOnRedirection: false,
                    });
                    return;
                } else {
                    // Fallback to Linking if InAppBrowser is not available
                    await Linking.openURL(finalUrl);
                }
            } catch (err) {
                // Fallback to Linking if InAppBrowser fails
                await Linking.openURL(finalUrl);
            }
        } else {
            // For non-http(s) URLs, use Linking
            const canOpen = await Linking.canOpenURL(finalUrl);
            if (!canOpen) {
                throw new Error(`Cannot open URL: ${finalUrl}`);
            }
            await Linking.openURL(finalUrl);
        }
    } catch (error: any) {
        Toast.show({
            type: 'error',
            text1: 'Cannot Open Url',
            text2: error.message,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });
    }
};
