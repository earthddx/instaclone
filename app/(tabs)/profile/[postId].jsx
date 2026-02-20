import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../../../context/UserContext";
import { getPost, deletePost } from "../../../lib/appwrite";
import MediaCard from "../../../components/MediaCard";

export default function PostDetail() {
  const { postId } = useLocalSearchParams();
  const { user } = React.useContext(UserContext);
  const router = useRouter();

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isFocused, setIsFocused] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  React.useEffect(() => {
    if (!postId) return;
    setPost(null);
    setLoading(true);
    getPost(postId)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const isOwner =
    post?.creator?.$id === user?.$id || post?.creator === user?.$id;

  const handleDelete = () => {
    Alert.alert(
      "Delete post",
      "Are you sure? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(postId);
              router.back();
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Failed to delete post. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#0C1929" }}
      edges={["top"]}
    >
      {/* Back header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 0.5,
          borderBottomColor: "#1A3060",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#4DA6FF" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 17,
            fontWeight: "700",
            marginLeft: 12,
          }}
        >
          Post
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color="#4DA6FF" size="large" />
        </View>
      ) : !post ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#888" }}>Post not found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <MediaCard
            {...post}
            creator={post.creator?.username ?? post.creator}
            creatorAvatar={post.creator?.avatar}
            isVisible={isFocused}
            currentUserId={user?.$id}
            currentUsername={user?.username}
            currentUserAvatar={user?.avatar}
            onDelete={isOwner ? handleDelete : undefined}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
