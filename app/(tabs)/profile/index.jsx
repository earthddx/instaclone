import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
  StyleSheet,
  Share,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { UserContext } from "../../../context/UserContext";
import { getUserPosts, getUserLikedPosts } from "../../../lib/appwrite";
import ComponentEmpty from "../../../components/ComponentEmpty";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - 2) / 3; // 2px total for 2 gaps between 3 columns

const ProfileContext = React.createContext(null);

export default function Profile() {
  const navigation = useNavigation();
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
          <Bio postsCount={userPosts.length} />

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

          {activeTab === 0 ? <UserPosts /> : <LikedVideos />}
        </ScrollView>
      </SafeAreaView>
    </ProfileContext.Provider>
  );
}

// --- Stat column ---
const StatItem = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value ?? "–"}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// --- Profile header (Bio) ---
const Bio = ({ postsCount }) => {
  const { user } = React.useContext(UserContext);
  const router = useRouter();

  return (
    <View style={styles.bioContainer}>
      {/* Avatar + Stats row */}
      <View style={styles.avatarStatsRow}>
        <View style={styles.avatarRing}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={34} color="#4DA6FF" />
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <StatItem value={postsCount} label="Posts" />
          <StatItem value={0} label="Followers" />
          <StatItem value={0} label="Following" />
        </View>
      </View>

      {/* Username + bio */}
      <Text style={styles.displayName} numberOfLines={1}>
        {user?.username ?? ""}
      </Text>
      {!!user?.bio && (
        <Text style={styles.bioText} numberOfLines={3}>
          {user.bio}
        </Text>
      )}

      {/* Action buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/profile/edit")}>
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
    </View>
  );
};

// --- Grid item ---
const GridItem = ({ item, index }) => {
  const router = useRouter();
  const isVideo = item.type?.includes("video");
  const uri = item.source?.replace("/preview", "/view");
  const marginLeft = index % 3 !== 0 ? 1 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{ width: ITEM_SIZE, height: ITEM_SIZE, marginLeft, marginBottom: 1 }}
      onPress={() => router.push({ pathname: `/(tabs)/profile/${item.$id}`, params: { creatorId: item.creator?.$id ?? item.creator } })}
    >
      {isVideo ? (
        item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: "100%", height: "100%", backgroundColor: "#0A1628", justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="play-circle" size={40} color="rgba(77,166,255,0.85)" />
          </View>
        )
      ) : (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      )}
      {isVideo && (
        <View style={{ position: "absolute", top: 6, right: 6 }}>
          <Ionicons name="play-circle" size={18} color="rgba(255,255,255,0.85)" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const renderGridItem = ({ item, index }) => <GridItem item={item} index={index} />;

// --- User Posts tab ---
const UserPosts = () => {
  const { userPosts } = React.useContext(ProfileContext);
  return (
    <FlatList
      data={userPosts}
      renderItem={renderGridItem}
      keyExtractor={(item) => item.$id}
      numColumns={3}
      scrollEnabled={false}
      ListEmptyComponent={<ComponentEmpty />}
    />
  );
};

// --- Liked Videos tab ---
const LikedVideos = () => {
  const { likedPosts } = React.useContext(ProfileContext);
  return (
    <FlatList
      data={likedPosts}
      renderItem={renderGridItem}
      keyExtractor={(item) => item.$id}
      numColumns={3}
      scrollEnabled={false}
      ListEmptyComponent={<ComponentEmpty message="No Liked Posts Found" />}
    />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },

  // --- Bio section ---
  bioContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#0C1929",
  },
  avatarStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: "#4DA6FF",
    overflow: "hidden",
    marginRight: 24,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: "#132040",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  statLabel: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  displayName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  bioText: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
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

  // --- Tab bar ---
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
