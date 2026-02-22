import React from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deletePost } from "../../lib/appwrite";
import { useToast } from "../../context/ToastContext";
import PostDetailScreen from "../../components/PostDetailScreen";

export default function PostDetail() {
  const { postId, creatorId } = useLocalSearchParams();
  const router = useRouter();
  const showToast = useToast();

  const handleDelete = () => {
    Alert.alert("Delete post", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId);
            showToast("Post deleted", "success");
            router.back();
          } catch (e) {
            console.error(e);
            showToast("Failed to delete post", "error");
          }
        },
      },
    ]);
  };

  return (
    <PostDetailScreen postId={postId} creatorId={creatorId} onDelete={handleDelete} />
  );
}
