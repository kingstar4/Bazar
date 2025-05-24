export type RootStackParamList = {
    Onboarding: undefined;
    RootNavigator: undefined;
    PublicRoutes: undefined;
    ProtectedRoutes: {
        screen: string;
        params?: object;
    };
};

export type ProtectedRoutes = {
    Home: undefined;
    Profile: undefined;
    Category: undefined;
    Cart: undefined;
};

export type PublicRoutes = {
    Login: undefined;
    Register: undefined;
};

export type AuthState = {
    isAuthenticated: boolean;
    initializing: boolean;
    setAuthenticated: (value: boolean) => void;
    setInitializing: (value: boolean) => void;
    logout: () => Promise<void>;
};

export interface Book {
    kind: 'books#volume';
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: {
        title: string;
        subtitle?: string;
        authors?: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        industryIdentifiers?: Array<{
            type: string;
            identifier: string;
        }>;
        pageCount?: number;
        dimensions?: {
            height?: string;
            width?: string;
            thickness?: string;
        };
        printType?: string;
        mainCategory?: string;
        categories?: string[];
        averageRating?: number;
        ratingsCount?: number;
        contentVersion?: string;
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            extraLarge?: string;
        };
        language?: string;
        previewLink?: string;
        infoLink?: string;
        canonicalVolumeLink?: string;
    };
    userInfo?: {
        isPurchased?: boolean;
        isPreordered?: boolean;
        updated?: string; // datetime string
    };
    saleInfo?: {
        country?: string;
        saleability: 'FOR_SALE' | 'NOT_FOR_SALE' | 'FREE' | 'FOR_PREVIEW' | 'UNKNOWN';
        onSaleDate?: string; // datetime string
        isEbook?: boolean;
        listPrice?: {
            amount: number;
            currencyCode: string;
        };
        retailPrice?: {
            amount: number;
            currencyCode: string;
        };
        buyLink?: string;
    };
    accessInfo?: {
        country?: string;
        viewability?: string;
        embeddable?: boolean;
        publicDomain?: boolean;
        textToSpeechPermission?: string;
        epub?: {
            isAvailable: boolean;
            downloadLink?: string;
            acsTokenLink?: string;
        };
        pdf?: {
            isAvailable: boolean;
            downloadLink?: string;
            acsTokenLink?: string;
        };
        webReaderLink?: string;
        accessViewStatus?: string;
        downloadAccess?: {
            kind: 'books#downloadAccessRestriction';
            volumeId: string;
            restricted: boolean;
            deviceAllowed: boolean;
            justAcquired: boolean;
            maxDownloadDevices: number;
            downloadsAcquired: number;
            nonce?: string;
            source?: string;
            reasonCode?: string;
            message?: string;
            signature?: string;
        };
    };
    searchInfo?: {
        textSnippet?: string;
    };
}

export interface ScrollEvent {
    nativeEvent: {
        contentOffset: {
            x: number;
        };
    };
};

export interface DownloadTask {
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

// src/types/react-native-background-downloader.d.ts
declare module 'react-native-background-downloader';