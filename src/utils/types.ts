// User profile type
export interface User {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  profileImage: string;
  bannerImage: string;
}

// Timeline post type (for renderTimelinePost item parameter)
export interface TimelinePost {
  id: number;
  content: string;
  image?: string; // Optional image
  likes: number;
  comments: number;
  time: string;
}

// Media post type (for renderMediaItem item parameter)
export type MediaPost = string; // Just a URL string

// Liked post type (for renderLikedPost item parameter)
export interface LikedPost {
  id: number;
  user: string;
  username: string;
  content: string;
  image?: string; // Optional image
  likes: number;
  time: string;
}

// Tab types
export type TabType = 'Timeline' | 'Media' | 'Likes';

// FlatList render item props types
export interface TimelineRenderItemProps {
  item: TimelinePost;
  index: number;
}

export interface MediaRenderItemProps {
  item: MediaPost;
  index: number;
}

export interface LikedPostRenderItemProps {
  item: LikedPost;
  index: number;
}

export type TimelineData = TimelinePost[];
export type MediaData = MediaPost[];
export type LikedPostsData = LikedPost[];

// Component props type (if you want to make this a reusable component)
export interface ProfileScreenProps {
  user?: User;
  timelinePosts?: TimelineData;
  mediaPosts?: MediaData;
  likedPosts?: LikedPostsData;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
  onBack?: () => void;
}



// src/types/navigation.ts

// Root stack decides which flow to show (Onboarding, Auth, App)
export type RootStackParamList = {
  OnboardingStack: undefined;
  PublicStack: undefined;
  ProtectedStack: undefined;
};

// Screens inside OnboardingStack
export type OnboardingStackParamList = {
  Onboarding: undefined;
};

// Screens inside AuthStack (PublicRoutes)
export type PublicStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Screens inside AppStack (ProtectedRoutes)
export type ProtectedParamList = {
  HomeStack: HomeParamList;
  Profile: ProfileParamList;
  Library: { search?: string } | undefined;
};

export type HomeParamList = {
  Home: undefined;
  Notification: undefined;
};

export type ProfileParamList ={
  Profile: undefined;
  FavouriteList: undefined;
}

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
    isFavourite?: boolean;
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