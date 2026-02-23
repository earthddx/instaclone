import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserById,
  getUserPosts,
  getFollowCounts,
  checkIsFollowing,
  followUser,
  unfollowUser,
} from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";
import ProfileBioSection from "../../components/ProfileBioSection";
import ProfilePostsGrid from "../../components/ProfilePostsGrid";
import { SkeletonProfileBio, SkeletonGrid } from "../../components/Skeleton";
import Colors from "../../constants/colors";

export default function UserProfile() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = React.useContext(UserContext);

  const [profile, setProfile] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [followDocId, setFollowDocId] = React.useState(null);
  const [followLoading, setFollowLoading] = React.useState(false);
  const [followCounts, setFollowCounts] = React.useState({ followers: 0, following: 0 });
  const [refreshing, setRefreshing] = React.useState(false);

  const isFollowing = followDocId !== null;

  const fetchAll = React.useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) setRefreshing(true);
    try {
      const [profileData, userPosts, counts] = await Promise.all([
        getUserById(userId),
        getUserPosts(userId),
        getFollowCounts(userId),
      ]);
      setProfile(profileData);
      setPosts(userPosts);
      setFollowCounts(counts);
      if (currentUser?.$id) {
        const docId = await checkIsFollowing(currentUser.$id, userId);
        setFollowDocId(docId);
      }
    } catch (e) {
      setError("Could not load profile.");
    } finally {
      setLoading(false);
      if (isPullRefresh) setRefreshing(false);
    }
  }, [userId, currentUser?.$id]);

  React.useEffect(() => {
    if (userId === currentUser?.$id) {
      router.replace("/(tabs)/profile");
      return;
    }
    fetchAll(false);
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!currentUser?.$id || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(followDocId);
        setFollowDocId(null);
        setFollowCounts((c) => ({ ...c, followers: Math.max(0, c.followers - 1) }));
      } else {
        const newDocId = await followUser(currentUser.$id, userId);
        setFollowDocId(newDocId);
        setFollowCounts((c) => ({ ...c, followers: c.followers + 1 }));
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShareProfile = () => {
    const message = profile?.bio
      ? `Check out @${profile.username} on InstaClone!\n\n"${profile.bio}"`
      : `Check out @${profile.username} on InstaClone!`;
    Share.share({ message });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
        <Header onBack={() => router.back()} username="" />
        <ScrollView>
          <SkeletonProfileBio />
          <View className="h-px bg-primary-300 mx-0" />
          <SkeletonGrid count={9} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
        <Header onBack={() => router.back()} username="" />
        <View className="flex-1 justify-center items-center gap-3">
          <Ionicons name="alert-circle-outline" size={48} color={Colors.muted.DEFAULT} />
          <Text className="text-muted text-[15px]">{error ?? "User not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
      <Header onBack={() => router.back()} username={profile.username} />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAll(true)}
            tintColor={Colors.secondary.DEFAULT}
            colors={[Colors.secondary.DEFAULT]}
          />
        }
      >
        <ProfileBioSection profile={profile} postsCount={posts.length} followersCount={followCounts.followers} followingCount={followCounts.following}>
          <View className="flex-row gap-2 mt-[10px]">
            <TouchableOpacity
              className={`flex-1 rounded-lg py-[7px] items-center border-[0.5px] ${
                isFollowing
                  ? "bg-primary-200 border-primary-300"
                  : "bg-highlight border-highlight"
              }`}
              onPress={handleFollowToggle}
              disabled={followLoading}
              activeOpacity={0.7}
            >
              <Text className="text-white text-[13px] font-semibold">
                {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary-200 rounded-lg py-[7px] items-center border-[0.5px] border-primary-300"
              onPress={handleShareProfile}
              activeOpacity={0.7}
            >
              <Text className="text-white text-[13px] font-semibold">Share profile</Text>
            </TouchableOpacity>
          </View>
        </ProfileBioSection>

        <ProfilePostsGrid
          posts={posts}
          onPressPost={(p) =>
            router.push({
              pathname: `/user/post/${p.$id}`,
              params: { creatorId: userId },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Header with back button ────────────────────────────────────────

function Header({ onBack, username }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-primary-300">
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.secondary.DEFAULT} />
      </TouchableOpacity>
      <Text className="text-white text-base font-bold flex-1 text-center mx-2" numberOfLines={1}>
        {username ? `@${username}` : ""}
      </Text>
      <View className="w-6" />
    </View>
  );
}
