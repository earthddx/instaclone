import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserById, getUserPosts } from "../../../lib/appwrite";
import { UserContext } from "../../../context/UserContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - 2) / 3;

export default function UserProfile() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = React.useContext(UserContext);

  const [profile, setProfile] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (userId === currentUser?.$id) {
      router.replace("/(tabs)/profile");
      return;
    }
    (async () => {
      try {
        const [profileData, userPosts] = await Promise.all([
          getUserById(userId),
          getUserPosts(userId),
        ]);
        setProfile(profileData);
        setPosts(userPosts);
      } catch (e) {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Header onBack={() => router.back()} username="" />
        <View style={styles.centered}>
          <ActivityIndicator color="#4DA6FF" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Header onBack={() => router.back()} username="" />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#4A6080" />
          <Text style={styles.errorText}>{error ?? "User not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header onBack={() => router.back()} username={profile.username} />

      <ScrollView style={{ flex: 1 }}>
        <ProfileHeader profile={profile} postsCount={posts.length} />
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item, index }) => <GridItem item={item} index={index} creatorId={userId} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="images-outline" size={48} color="#1A3060" />
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function Header({ onBack, username }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color="#4DA6FF" />
      </TouchableOpacity>
      <Text style={styles.headerUsername} numberOfLines={1}>
        {username ? `@${username}` : ""}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

function ProfileHeader({ profile, postsCount }) {
  return (
    <View style={styles.bioContainer}>
      <View style={styles.avatarStatsRow}>
        <View style={styles.avatarRing}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
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

      <Text style={styles.displayName} numberOfLines={1}>
        {profile.username}
      </Text>
      {!!profile.bio && (
        <Text style={styles.bioText} numberOfLines={4}>
          {profile.bio}
        </Text>
      )}

      <View style={styles.divider} />
    </View>
  );
}

function StatItem({ value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value ?? "–"}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function GridItem({ item, index, creatorId }) {
  const router = useRouter();
  const isVideo = item.type?.includes("video");
  const uri = item.source?.replace("/preview", "/view");
  const marginLeft = index % 3 !== 0 ? 1 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{ width: ITEM_SIZE, height: ITEM_SIZE, marginLeft, marginBottom: 1 }}
      onPress={() => router.push({ pathname: `/user/post/${item.$id}`, params: { creatorId } })}
    >
      {isVideo ? (
        item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.videoPlaceholder}>
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
        <View style={styles.videoIcon}>
          <Ionicons name="play-circle" size={18} color="rgba(255,255,255,0.85)" />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    color: "#4A6080",
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A3060",
  },
  headerUsername: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  bioContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 0,
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
  divider: {
    height: 1,
    backgroundColor: "#1A3060",
    marginTop: 12,
    marginHorizontal: -16,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: "#4A6080",
    fontSize: 15,
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0A1628",
    justifyContent: "center",
    alignItems: "center",
  },
  videoIcon: {
    position: "absolute",
    top: 6,
    right: 6,
  },
});
