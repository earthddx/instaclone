import { useFocusEffect, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { UserContext } from "../../../context/UserContext";
import { getUserPosts, getUserLikedPosts } from "../../../lib/appwrite";
import ComponentEmpty from "../../../components/ComponentEmpty";

const Tab = createMaterialTopTabNavigator();
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - 2) / 3; // 2px total for 2 gaps between 3 columns

export default function Profile() {
  const navigation = useNavigation();
  const { user } = React.useContext(UserContext);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header — matches messages screen style */}
      <View className="px-4 py-3 border-b border-primary-300 flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
          <Ionicons name="person" size={16} color="#4DA6FF" />
        </View>
        <Text className="text-white text-lg font-bold">
          {"Profile"}
        </Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color="#4DA6FF" />
        </TouchableOpacity>
      </View>

      <Bio />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#555",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0C1929",
            borderTopWidth: 0.5,
            borderTopColor: "#1A3060",
            elevation: 0,
            shadowOpacity: 0,
            height: 44,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#4DA6FF",
            height: 2,
            bottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="User Posts"
          component={UserPosts}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Liked Videos"
          component={LikedVideos}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
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
const Bio = () => {
  const { user } = React.useContext(UserContext);
  const [postsCount, setPostsCount] = React.useState(null);

  React.useEffect(() => {
    if (user?.$id) {
      getUserPosts(user.$id).then((posts) => setPostsCount(posts.length));
    }
  }, [user?.$id]);

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
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Share profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Grid item ---
const renderGridItem = ({ item, index }) => {
  const isVideo = item.type?.includes("video");
  const uri = item.source?.replace("/preview", "/view");
  const marginLeft = index % 3 !== 0 ? 1 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{ width: ITEM_SIZE, height: ITEM_SIZE, marginLeft, marginBottom: 1 }}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
      {isVideo && (
        <View style={{ position: "absolute", top: 6, right: 6 }}>
          <Ionicons name="play-circle" size={18} color="rgba(255,255,255,0.85)" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// --- User Posts tab ---
const UserPosts = () => {
  const { user } = React.useContext(UserContext);
  const [userPosts, setUserPosts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchPosts = React.useCallback(async () => {
    if (!user?.$id) return;
    setRefreshing(true);
    try {
      const posts = await getUserPosts(user.$id);
      setUserPosts(posts);
    } finally {
      setRefreshing(false);
    }
  }, [user?.$id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={userPosts}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        ListEmptyComponent={<ComponentEmpty />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPosts}
            tintColor="#4DA6FF"
            colors={["#4DA6FF"]}
          />
        }
      />
    </View>
  );
};

// --- Liked Videos tab ---
const LikedVideos = () => {
  const { user } = React.useContext(UserContext);
  const [likedPosts, setLikedPosts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchLikedPosts = React.useCallback(async () => {
    if (!user?.$id) return;
    setRefreshing(true);
    try {
      const posts = await getUserLikedPosts(user.$id);
      setLikedPosts(posts);
    } finally {
      setRefreshing(false);
    }
  }, [user?.$id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLikedPosts();
    }, [fetchLikedPosts])
  );

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={likedPosts}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        ListEmptyComponent={<ComponentEmpty message="No Liked Posts Found" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchLikedPosts}
            tintColor="#4DA6FF"
            colors={["#4DA6FF"]}
          />
        }
      />
    </View>
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

  // --- Tabs / grid ---
  tabContent: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
});
