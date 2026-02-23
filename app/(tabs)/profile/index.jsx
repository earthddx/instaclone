import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Share,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { UserContext } from "../../../context/UserContext";
import { getUserPosts, getUserLikedPosts, getFollowCounts } from "../../../lib/appwrite";
import ProfileBioSection from "../../../components/ProfileBioSection";
import ProfilePostsGrid from "../../../components/ProfilePostsGrid";
import { SkeletonProfileBio } from "../../../components/Skeleton";
import Colors from "../../../constants/colors";

const ProfileContext = React.createContext(null);

export default function Profile() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const [userPosts, setUserPosts] = React.useState([]);
  const [likedPosts, setLikedPosts] = React.useState([]);
  const [followCounts, setFollowCounts] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [postsLoading, setPostsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(0);
  const { width } = useWindowDimensions();
  const pagerRef = React.useRef(null);

  const goToTab = React.useCallback((index) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  }, [width]);

  const onScrollEnd = React.useCallback((e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveTab(index);
  }, [width]);

  const fetchAll = React.useCallback(async (isPullRefresh = false) => {
    if (!user?.$id) return;
    if (isPullRefresh) setRefreshing(true);
    try {
      const [posts, liked, counts] = await Promise.all([
        getUserPosts(user.$id),
        getUserLikedPosts(user.$id),
        getFollowCounts(user.$id),
      ]);
      setUserPosts(posts);
      setLikedPosts(liked);
      setFollowCounts(counts);
    } finally {
      if (isPullRefresh) setRefreshing(false);
      setPostsLoading(false);
    }
  }, [user?.$id]);

  useFocusEffect(React.useCallback(() => { fetchAll(false); }, [fetchAll]));

  return (
    <ProfileContext.Provider value={{ userPosts, likedPosts, postsLoading }}>
      <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
        {/* Header */}
        <View className="px-4 py-3 border-b border-primary-300 flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
            <Ionicons name="person" size={16} color={Colors.secondary.DEFAULT} />
          </View>
          <Text className="text-white text-lg font-bold">Profile</Text>
          <View className="flex-1" />
          <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
            <Ionicons name="menu" size={24} color={Colors.secondary.DEFAULT} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          automaticallyAdjustContentInsets={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAll(true)}
              tintColor={Colors.secondary.DEFAULT}
              colors={[Colors.secondary.DEFAULT]}
            />
          }
        >
          {postsLoading ? (
            <SkeletonProfileBio showButtons />
          ) : (
            <ProfileBioSection
              profile={user}
              postsCount={userPosts.length}
              followersCount={followCounts?.followers}
              followingCount={followCounts?.following}
            >
              <View className="flex-row gap-2 mt-[10px]">
                <TouchableOpacity
                  className="flex-1 bg-primary-200 rounded-lg py-[7px] items-center border-[0.5px] border-primary-300"
                  onPress={() => router.push("/(tabs)/profile/edit")}
                >
                  <Text className="text-white text-[13px] font-semibold">Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-primary-200 rounded-lg py-[7px] items-center border-[0.5px] border-primary-300"
                  onPress={() => {
                    const message = user?.bio
                      ? `Check out @${user.username} on InstaClone!\n\n"${user.bio}"`
                      : `Check out @${user.username} on InstaClone!`;
                    Share.share({ message });
                  }}
                >
                  <Text className="text-white text-[13px] font-semibold">Share profile</Text>
                </TouchableOpacity>
              </View>
            </ProfileBioSection>
          )}

          {/* Tab Bar */}
          <View className="flex-row bg-primary-100 border-t-[0.5px] border-primary-300 h-11">
            <TouchableOpacity
              className={`flex-1 items-center justify-center ${activeTab === 0 ? 'border-b-2 border-secondary' : ''}`}
              onPress={() => goToTab(0)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === 0 ? "grid" : "grid-outline"}
                size={22}
                color={activeTab === 0 ? "#fff" : Colors.muted.DEFAULT}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center justify-center ${activeTab === 1 ? 'border-b-2 border-secondary' : ''}`}
              onPress={() => goToTab(1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === 1 ? "heart" : "heart-outline"}
                size={22}
                color={activeTab === 1 ? "#fff" : "#555"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onMomentumScrollEnd={onScrollEnd}
            scrollEventThrottle={16}
          >
            <View style={{ width }}><PostsGrid /></View>
            <View style={{ width }}><LikedVideos /></View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </ProfileContext.Provider>
  );
}

// --- Posts grid tab ---
const PostsGrid = () => {
  const { userPosts, postsLoading } = React.useContext(ProfileContext);
  const router = useRouter();
  return (
    <ProfilePostsGrid
      posts={userPosts}
      loading={postsLoading}
      onPressPost={(p) =>
        router.push({
          pathname: `/post/${p.$id}`,
          params: { creatorId: p.creator?.$id ?? p.creator },
        })
      }
    />
  );
};

// --- Liked videos tab ---
const LikedVideos = () => {
  const { likedPosts, postsLoading } = React.useContext(ProfileContext);
  const router = useRouter();
  return (
    <ProfilePostsGrid
      posts={likedPosts}
      loading={postsLoading}
      onPressPost={(p) =>
        router.push({
          pathname: `/post/${p.$id}`,
          params: { creatorId: p.creator?.$id ?? p.creator },
        })
      }
      emptyMessage="No Liked Posts Found"
    />
  );
};
