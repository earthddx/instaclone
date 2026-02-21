import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
          style={{ flex: 1 }}
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
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push("/(tabs)/profile/edit")}
              >
                <Text style={styles.actionBtnText}>Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  const message = user?.bio
                    ? `Check out @${user.username} on InstaClone!\n\n"${user.bio}"`
                    : `Check out @${user.username} on InstaClone!`;
                  Share.share({ message });
                }}
              >
                <Text style={styles.actionBtnText}>Share profile</Text>
              </TouchableOpacity>
            </View>
          </ProfileBioSection>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 0 && styles.tabBtnActive]}
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
              style={[styles.tabBtn, activeTab === 1 && styles.tabBtnActive]}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#132040",
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#2A4080",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0C1929",
    borderTopWidth: 0.5,
    borderTopColor: "#1A3060",
    height: 44,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#4DA6FF",
  },
});
