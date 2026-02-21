import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Share,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { UserContext } from "../../../context/UserContext";
import { getUserPosts, getUserLikedPosts } from "../../../lib/appwrite";
import ComponentEmpty from "../../../components/ComponentEmpty";
import ProfileBioSection from "../../../components/ProfileBioSection";
import ProfileGridItem from "../../../components/ProfileGridItem";

const ProfileContext = React.createContext(null);

export default function Profile() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const [userPosts, setUserPosts] = React.useState([]);
  const [likedPosts, setLikedPosts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const fetchAll = React.useCallback(async (isPullRefresh = false) => {
    if (!user?.$id) return;
    if (isPullRefresh) setRefreshing(true);
    try {
      const [posts, liked] = await Promise.all([
        getUserPosts(user.$id),
        getUserLikedPosts(user.$id),
      ]);
      setUserPosts(posts);
      setLikedPosts(liked);
    } finally {
      if (isPullRefresh) setRefreshing(false);
    }
  }, [user?.$id]);

  useFocusEffect(React.useCallback(() => { fetchAll(false); }, [fetchAll]));

  return (
    <ProfileContext.Provider value={{ userPosts, likedPosts }}>
      <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
        {/* Header */}
        <View className="px-4 py-3 border-b border-primary-300 flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
            <Ionicons name="person" size={16} color="#4DA6FF" />
          </View>
          <Text className="text-white text-lg font-bold">Profile</Text>
          <View className="flex-1" />
          <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
            <Ionicons name="menu" size={24} color="#4DA6FF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          automaticallyAdjustContentInsets={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAll(true)}
              tintColor="#4DA6FF"
              colors={["#4DA6FF"]}
            />
          }
        >
          <ProfileBioSection profile={user} postsCount={userPosts.length}>
            <View className="flex-row gap-2 mt-[10px]">
              <TouchableOpacity
                className="flex-1 bg-primary-200 rounded-lg py-[7px] items-center border-[0.5px] border-[#2A4080]"
                onPress={() => router.push("/(tabs)/profile/edit")}
              >
                <Text className="text-white text-[13px] font-semibold">Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary-200 rounded-lg py-[7px] items-center border-[0.5px] border-[#2A4080]"
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

          {/* Tab Bar */}
          <View className="flex-row bg-primary-100 border-t-[0.5px] border-primary-300 h-11">
            <TouchableOpacity
              className={`flex-1 items-center justify-center ${activeTab === 0 ? 'border-b-2 border-secondary' : ''}`}
              onPress={() => setActiveTab(0)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === 0 ? "grid" : "grid-outline"}
                size={22}
                color={activeTab === 0 ? "#fff" : "#555"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center justify-center ${activeTab === 1 ? 'border-b-2 border-secondary' : ''}`}
              onPress={() => setActiveTab(1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === 1 ? "heart" : "heart-outline"}
                size={22}
                color={activeTab === 1 ? "#fff" : "#555"}
              />
            </TouchableOpacity>
          </View>

          {activeTab === 0 ? <PostsGrid /> : <LikedVideos />}
        </ScrollView>
      </SafeAreaView>
    </ProfileContext.Provider>
  );
}

// --- Posts grid tab ---
const PostsGrid = () => {
  const { userPosts } = React.useContext(ProfileContext);
  const router = useRouter();
  return (
    <FlatList
      data={userPosts}
      keyExtractor={(item) => item.$id}
      numColumns={3}
      scrollEnabled={false}
      ListEmptyComponent={<ComponentEmpty />}
      renderItem={({ item, index }) => (
        <ProfileGridItem
          item={item}
          index={index}
          onPress={(p) =>
            router.push({
              pathname: `/(tabs)/profile/${p.$id}`,
              params: { creatorId: p.creator?.$id ?? p.creator },
            })
          }
        />
      )}
    />
  );
};

// --- Liked videos tab ---
const LikedVideos = () => {
  const { likedPosts } = React.useContext(ProfileContext);
  const router = useRouter();
  return (
    <FlatList
      data={likedPosts}
      keyExtractor={(item) => item.$id}
      numColumns={3}
      scrollEnabled={false}
      ListEmptyComponent={<ComponentEmpty message="No Liked Posts Found" />}
      renderItem={({ item, index }) => (
        <ProfileGridItem
          item={item}
          index={index}
          onPress={(p) =>
            router.push({
              pathname: `/(tabs)/profile/${p.$id}`,
              params: { creatorId: p.creator?.$id ?? p.creator },
            })
          }
        />
      )}
    />
  );
};
