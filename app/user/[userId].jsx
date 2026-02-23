import React from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserById, getUserPosts } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";
import ProfileBioSection from "../../components/ProfileBioSection";
import ProfileGridItem from "../../components/ProfileGridItem";
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

      <ScrollView className="flex-1">
        <ProfileBioSection profile={profile} postsCount={posts.length}>
          <View className="h-px bg-primary-300 mt-3 -mx-4" />
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
            <View className="items-center pt-[60px] gap-3">
              <Ionicons name="images-outline" size={48} color={Colors.primary[300]} />
              <Text className="text-muted text-[15px]">No posts yet</Text>
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
