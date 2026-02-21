import React from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserById, getUserPosts } from "../../../lib/appwrite";
import { UserContext } from "../../../context/UserContext";
import ProfileBioSection from "../../../components/ProfileBioSection";
import ProfileGridItem from "../../../components/ProfileGridItem";

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
        <ProfileBioSection profile={profile} postsCount={posts.length}>
          <View style={styles.divider} />
        </ProfileBioSection>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <ProfileGridItem
              item={item}
              index={index}
              onPress={(p) =>
                router.push({
                  pathname: `/user/post/${p.$id}`,
                  params: { creatorId: userId },
                })
              }
            />
          )}
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

// ─── Header with back button ────────────────────────────────────────

function Header({ onBack, username }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#4DA6FF" />
      </TouchableOpacity>
      <Text style={styles.headerUsername} numberOfLines={1}>
        {username ? `@${username}` : ""}
      </Text>
      <View style={{ width: 24 }} />
    </View>
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
});
