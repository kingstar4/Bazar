import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaRenderItemProps, TimelineRenderItemProps, LikedPostRenderItemProps } from '../../../navigation/types';

// Mock icons - in a real app you'd use react-native-vector-icons or similar
const ArrowBackIcon = () => <Text style={styles.icon}>←</Text>;
const SettingsIcon = () => <Text style={styles.icon}>⚙️</Text>;
const CameraIcon = () => <Text style={styles.icon}>📷</Text>;
const LocationIcon = () => <Text style={styles.icon}>📍</Text>;
const LinkIcon = () => <Text style={styles.icon}>🔗</Text>;
const CalendarIcon = () => <Text style={styles.icon}>📅</Text>;
const HeartIcon = () => <Text style={styles.icon}>❤️</Text>;
const CommentIcon = () => <Text style={styles.icon}>💬</Text>;
const ShareIcon = () => <Text style={styles.icon}>↗️</Text>;
const UserPlusIcon = () => <Text style={styles.icon}>👤+</Text>;

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 60;
const PROFILE_HEADER_HEIGHT = 400;

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('Timeline');
  const scrollY = useRef(new Animated.Value(0)).current;
  const tabScrollViews = useRef({});

  const user = {
    firstName: 'Sarah',
    lastName: 'Chen',
    username: '@sarahchen',
    bio: 'Digital artist & creative designer ✨ Turning ideas into visual stories',
    location: 'San Francisco, CA',
    website: 'sarahchen.design',
    joinDate: 'Joined March 2020',
    followers: 12847,
    following: 892,
    posts: 1247,
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bannerImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop',
  };

  const timelinePosts = [
    {
      id: 1,
      content: "Just finished working on an amazing new project! The creative process never gets old 🎨✨",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      likes: 127,
      comments: 23,
      time: "2h ago"
    },
    {
      id: 2,
      content: "Morning coffee and sketching session. There's something magical about early morning creativity ☕️",
      likes: 94,
      comments: 12,
      time: "1d ago"
    },
    {
      id: 3,
      content: "Collaboration with @designstudio was incredible! Can't wait to share the final results 🚀",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
      likes: 203,
      comments: 45,
      time: "3d ago"
    },
  ];

  const mediaPosts = [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  ];

  const likedPosts = [
    {
      id: 1,
      user: "Alex Rodriguez",
      username: "@alexr",
      content: "Beautiful sunset at the beach today 🌅",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      likes: 89,
      time: "4h ago"
    },
    {
      id: 2,
      user: "Maya Patel",
      username: "@mayap",
      content: "New art piece finished! Mixed media exploration of urban landscapes 🏙️",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=300&fit=crop",
      likes: 156,
      time: "1d ago"
    }
  ];

  // Animated values for header and profile header
  const headerOpacity = scrollY.interpolate({
    inputRange: [PROFILE_HEADER_HEIGHT * 0.3, PROFILE_HEADER_HEIGHT * 0.7],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const profileHeaderOpacity = scrollY.interpolate({
    inputRange: [0, PROFILE_HEADER_HEIGHT * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const profileHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, PROFILE_HEADER_HEIGHT],
    outputRange: [0, -PROFILE_HEADER_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const renderTimelinePost = ({ item }:TimelineRenderItemProps) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: user.profileImage }} style={styles.postAvatar} />
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <HeartIcon />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <CommentIcon />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMediaItem = ({ item, index }:MediaRenderItemProps) => (
    <TouchableOpacity style={styles.mediaItem}>
      <Image source={{ uri: item }} style={styles.mediaImage} />
    </TouchableOpacity>
  );

  const renderLikedPost = ({ item }:LikedPostRenderItemProps) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.likedPostAvatar}>
          <Text style={styles.likedPostAvatarText}>
            {item.user.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{item.user}</Text>
          <Text style={styles.postTime}>{item.username} • {item.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postActions}>
        <TouchableOpacity style={[styles.actionButton, styles.likedAction]}>
          <HeartIcon />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <CommentIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Timeline':
        return (
          <FlatList
            data={timelinePosts}
            renderItem={renderTimelinePost}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabContent}
          />
        );
      case 'Media':
        return (
          <FlatList
            key="mediaGrid"  // Add this key
            data={mediaPosts}
            renderItem={renderMediaItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mediaGrid}
          />
        );
      case 'Likes':
        return (
          <FlatList
            data={likedPosts}
            renderItem={renderLikedPost}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.headerButton}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <SettingsIcon />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: profileHeaderOpacity,
              transform: [{ translateY: profileHeaderTranslateY }],
            },
          ]}
        >
          {/* Banner */}
          <View style={styles.banner}>
            <Image source={{ uri: user.bannerImage }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <TouchableOpacity style={styles.bannerButton}>
                <ArrowBackIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bannerButton}>
                <SettingsIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {/* Profile Picture */}
            <View style={styles.profilePictureContainer}>
              <Image source={{ uri: user.profileImage }} style={styles.profilePicture} />
              <TouchableOpacity style={styles.cameraButton}>
                <CameraIcon />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.userHandle}>{user.username}</Text>
              <Text style={styles.userBio}>{user.bio}</Text>

              <View style={styles.userDetails}>
                <View style={styles.detailItem}>
                  <LocationIcon />
                  <Text style={styles.detailText}>{user.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <LinkIcon />
                  <Text style={[styles.detailText, styles.linkText]}>{user.website}</Text>
                </View>
                <View style={styles.detailItem}>
                  <CalendarIcon />
                  <Text style={styles.detailText}>{user.joinDate}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.posts.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.followers.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.following.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followButton}>
                  <UserPlusIcon />
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.messageButton}>
                  <CommentIcon />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {['Timeline', 'Media', 'Likes'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 0,
    height: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
  },
  banner: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: StatusBar.currentHeight || 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  profileInfo: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profilePictureContainer: {
    marginTop: -64,
    marginBottom: 16,
    position: 'relative',
  },
  profilePicture: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: 'white',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    gap: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userHandle: {
    fontSize: 16,
    color: '#666',
  },
  userBio: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  userDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    color: '#007AFF',
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  followButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#007AFF',
  },
  tabContentContainer: {
    backgroundColor: '#f5f5f5',
    minHeight: height,
  },
  tabContent: {
    padding: 16,
    paddingBottom: 80,
  },
  mediaGrid: {
    padding: 2,
  },
  mediaItem: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 1,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  likedPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  likedPostAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  likedAction: {
    backgroundColor: '#ffe6e6',
  },
  icon: {
    fontSize: 20,
  },
});

export default ProfileScreen;