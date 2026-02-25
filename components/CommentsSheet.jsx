import React from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getComments, addComment } from "../lib/appwrite";
import Colors from "../constants/colors";
import BottomSheet from "./BottomSheet";

const avatarLetter = (name) => name?.[0]?.toUpperCase() ?? "?";

const CommentItem = ({ item, onAvatarPress, onReplyPress, replyCount, isExpanded, onToggleReplies }) => {
  return (
    <View>
      <View className="flex-row mb-1.5 items-start">
        <TouchableOpacity
          onPress={() => onAvatarPress(item.creator?.$id)}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-surface-300 justify-center items-center mr-2.5 overflow-hidden"
        >
          {item.creator?.avatar ? (
            <Image source={{ uri: item.creator.avatar }} className="w-9 h-9" />
          ) : (
            <Text className="text-secondary font-bold text-[14px]">
              {avatarLetter(item.creator?.username)}
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-[13px] leading-[19px]">
            <Text className="font-bold">@{item.creator?.username}{" "}</Text>
            {item.text}
          </Text>
          <View className="flex-row items-center mt-[3px] gap-3">
            <Text className="text-muted text-[11px]">
              {new Date(item.$createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <TouchableOpacity onPress={() => onReplyPress(item.$id, item.creator?.username)}>
              <Text className="text-muted text-[11px] font-semibold">Reply</Text>
            </TouchableOpacity>
          </View>
          {replyCount > 0 && (
            <TouchableOpacity
              onPress={onToggleReplies}
              className="mt-1.5 flex-row items-center gap-1.5"
            >
              <View className="w-5 h-px bg-muted" />
              <Text className="text-muted text-[12px]">
                {isExpanded
                  ? "Hide replies"
                  : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const ReplyItem = ({ item, onAvatarPress }) => {
  return (
    <View className="flex-row mb-3 items-start ml-[46px]">
      <TouchableOpacity
        onPress={() => onAvatarPress(item.creator?.$id)}
        activeOpacity={0.7}
        className="w-7 h-7 rounded-full bg-surface-300 justify-center items-center mr-2 overflow-hidden"
      >
        {item.creator?.avatar ? (
          <Image source={{ uri: item.creator.avatar }} className="w-7 h-7" />
        ) : (
          <Text className="text-secondary font-bold text-[11px]">
            {avatarLetter(item.creator?.username)}
          </Text>
        )}
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-white text-[12px] leading-[17px]">
          <Text className="font-bold">@{item.creator?.username}{" "}</Text>
          {item.text}
        </Text>
        <Text className="text-muted text-[10px] mt-0.5">
          {new Date(item.$createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
    </View>
  );
};

export default function CommentsSheet({
  visible,
  postId,
  currentUserId,
  currentUsername,
  currentUserAvatar,
  onClose,
  onCommentCountChange,
}) {
  const router = useRouter();
  const sheetRef = React.useRef();

  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [replyingTo, setReplyingTo] = React.useState(null); // { id, username }
  const [expandedComments, setExpandedComments] = React.useState(new Set());
  const commentToastOpacity = React.useRef(new Animated.Value(0)).current;

  const topLevelComments = React.useMemo(
    () => comments.filter((c) => !c.parentId),
    [comments]
  );

  const repliesFor = React.useCallback(
    (commentId) => comments.filter((c) => c.parentId === commentId),
    [comments]
  );

  const showCommentToast = () => {
    Animated.sequence([
      Animated.timing(commentToastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(commentToastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  // Called by BottomSheet after the slide-out animation for all dismiss sources.
  // Clears local state, then notifies the parent.
  const handleClose = React.useCallback(() => {
    setComment("");
    setReplyingTo(null);
    setExpandedComments(new Set());
    onClose();
  }, [onClose]);

  // Slide sheet out first, then navigate (matches original UX order)
  const handleNavigateToUser = (userId) => {
    if (!userId) return;
    sheetRef.current?.close(() => {
      if (userId === currentUserId) {
        router.push("/(tabs)/profile");
      } else {
        router.push(`/user/${userId}`);
      }
    });
  };

  const handleReplyPress = (commentId, username) => {
    setReplyingTo({ id: commentId, username });
  };

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  // Fetch comments + reset UI state whenever the sheet opens
  React.useEffect(() => {
    if (!visible) return;
    setReplyingTo(null);
    setExpandedComments(new Set());
    setLoadingComments(true);
    getComments(postId)
      .then((fetched) => {
        setComments(fetched);
        onCommentCountChange?.(fetched.length);
      })
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [visible, postId]);

  const handleSubmitComment = async () => {
    if (!comment.trim() || !currentUserId) return;
    const text = comment.trim();
    const parentId = replyingTo?.id ?? null;
    setComment("");
    setReplyingTo(null);
    try {
      const newComment = await addComment({
        postId,
        userId: currentUserId,
        text,
        parentId,
      });
      setComments((prev) => {
        const next = [...prev, newComment];
        onCommentCountChange?.(next.length);
        return next;
      });
      if (parentId) {
        setExpandedComments((prev) => new Set([...prev, parentId]));
      }
      showCommentToast();
    } catch (e) {
      Alert.alert("Failed to post comment", e?.message ?? "Unknown error");
    }
  };

  const renderTopLevelComment = ({ item }) => {
    const replies = repliesFor(item.$id);
    const isExpanded = expandedComments.has(item.$id);
    return (
      <View className="mb-[14px]">
        <CommentItem
          item={item}
          onAvatarPress={handleNavigateToUser}
          onReplyPress={handleReplyPress}
          replyCount={replies.length}
          isExpanded={isExpanded}
          onToggleReplies={() => toggleReplies(item.$id)}
        />
        {isExpanded && replies.map((reply) => (
          <ReplyItem key={reply.$id} item={reply} onAvatarPress={handleNavigateToUser} />
        ))}
      </View>
    );
  };

  return (
    <BottomSheet
      ref={sheetRef}
      visible={visible}
      onClose={handleClose}
      title="Comments"
      centerTitle
      keyboardAware
    >
      {/* Comment list */}
      {loadingComments ? (
        <ActivityIndicator
          color={Colors.secondary.DEFAULT}
          className="flex-1 self-center"
        />
      ) : (
        <FlatList
          data={topLevelComments}
          keyExtractor={(item) => item.$id}
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text className="text-muted text-center py-8 text-sm">
              No comments yet. Be the first!
            </Text>
          }
          renderItem={renderTopLevelComment}
        />
      )}

      {/* Comment-added toast (above the input bar) */}
      <Animated.View
        pointerEvents="none"
        className="absolute bottom-[70px] left-4 right-4 bg-surface-100 rounded-[10px] px-[14px] py-[10px] flex-row items-center border-l-[3px] border-l-success z-10"
        style={{ opacity: commentToastOpacity }}
      >
        <Ionicons name="checkmark-circle" size={18} color={Colors.success} style={{ marginRight: 8 }} />
        <Text className="text-white text-[13px]">Comment added</Text>
      </Animated.View>

      {/* Input bar */}
      <View className="border-t border-surface-300">
        {/* Replying-to banner */}
        {replyingTo && (
          <View className="flex-row items-center justify-between px-[14px] pt-2">
            <Text className="text-muted text-[12px]">
              Replying to{" "}
              <Text className="text-secondary font-semibold">
                @{replyingTo.username}
              </Text>
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close" size={16} color={Colors.muted.DEFAULT} />
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row items-center px-[14px] py-[10px]">
          {/* Current-user avatar */}
          <View className="w-[34px] h-[34px] rounded-full bg-surface-300 justify-center items-center mr-2.5 overflow-hidden">
            {currentUserAvatar ? (
              <Image source={{ uri: currentUserAvatar }} className="w-[34px] h-[34px]" />
            ) : (
              <Text className="text-secondary font-bold text-[13px]">
                {avatarLetter(currentUsername)}
              </Text>
            )}
          </View>

          {/* Text input */}
          <View
            className="flex-1 bg-surface-200 border border-surface-400 rounded-[20px] px-[14px] py-2"
            style={{ marginRight: comment.trim().length > 0 ? 10 : 0 }}
          >
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
              placeholderTextColor={Colors.muted.DEFAULT}
              className="text-white text-[14px] max-h-[100px]"
              multiline
            />
          </View>

          {comment.trim().length > 0 && (
            <TouchableOpacity onPress={handleSubmitComment}>
              <Text className="text-secondary font-bold text-[14px]">
                Post
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BottomSheet>
  );
}
