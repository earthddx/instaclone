import React from "react";
import {
  View,
  Text,
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
      <View style={{ flexDirection: "row", marginBottom: 6, alignItems: "flex-start" }}>
        <TouchableOpacity
          onPress={() => onAvatarPress(item.creator?.$id)}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: Colors.surface[300],
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            overflow: "hidden",
          }}
        >
          {item.creator?.avatar ? (
            <Image source={{ uri: item.creator.avatar }} style={{ width: 36, height: 36 }} />
          ) : (
            <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "bold", fontSize: 14 }}>
              {avatarLetter(item.creator?.username)}
            </Text>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 13, lineHeight: 19 }}>
            <Text style={{ fontWeight: "700" }}>@{item.creator?.username}{" "}</Text>
            {item.text}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3, gap: 12 }}>
            <Text style={{ color: Colors.muted.DEFAULT, fontSize: 11 }}>
              {new Date(item.$createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <TouchableOpacity onPress={() => onReplyPress(item.$id, item.creator?.username)}>
              <Text style={{ color: Colors.muted.DEFAULT, fontSize: 11, fontWeight: "600" }}>Reply</Text>
            </TouchableOpacity>
          </View>
          {replyCount > 0 && (
            <TouchableOpacity
              onPress={onToggleReplies}
              style={{ marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View style={{ width: 20, height: 1, backgroundColor: Colors.muted.DEFAULT }} />
              <Text style={{ color: Colors.muted.DEFAULT, fontSize: 12 }}>
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
    <View style={{ flexDirection: "row", marginBottom: 12, alignItems: "flex-start", marginLeft: 46 }}>
      <TouchableOpacity
        onPress={() => onAvatarPress(item.creator?.$id)}
        activeOpacity={0.7}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: Colors.surface[300],
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
          overflow: "hidden",
        }}
      >
        {item.creator?.avatar ? (
          <Image source={{ uri: item.creator.avatar }} style={{ width: 28, height: 28 }} />
        ) : (
          <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "bold", fontSize: 11 }}>
            {avatarLetter(item.creator?.username)}
          </Text>
        )}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontSize: 12, lineHeight: 17 }}>
          <Text style={{ fontWeight: "700" }}>@{item.creator?.username}{" "}</Text>
          {item.text}
        </Text>
        <Text style={{ color: Colors.muted.DEFAULT, fontSize: 10, marginTop: 2 }}>
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
    } catch {}
  };

  const renderTopLevelComment = ({ item }) => {
    const replies = repliesFor(item.$id);
    const isExpanded = expandedComments.has(item.$id);
    return (
      <View style={{ marginBottom: 14 }}>
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
          style={{ flex: 1, alignSelf: "center" }}
        />
      ) : (
        <FlatList
          data={topLevelComments}
          keyExtractor={(item) => item.$id}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text
              style={{
                color: Colors.muted.DEFAULT,
                textAlign: "center",
                paddingVertical: 32,
                fontSize: 14,
              }}
            >
              No comments yet. Be the first!
            </Text>
          }
          renderItem={renderTopLevelComment}
        />
      )}

      {/* Comment-added toast (above the input bar) */}
      <Animated.View
        pointerEvents="none"
        style={{
          opacity: commentToastOpacity,
          position: "absolute",
          bottom: 70,
          left: 16,
          right: 16,
          backgroundColor: Colors.surface[100],
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          borderLeftWidth: 3,
          borderLeftColor: Colors.success,
          zIndex: 10,
        }}
      >
        <Ionicons name="checkmark-circle" size={18} color={Colors.success} style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontSize: 13 }}>Comment added</Text>
      </Animated.View>

      {/* Input bar */}
      <View style={{ borderTopWidth: 1, borderTopColor: Colors.surface[300] }}>
        {/* Replying-to banner */}
        {replyingTo && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              paddingTop: 8,
            }}
          >
            <Text style={{ color: Colors.muted.DEFAULT, fontSize: 12 }}>
              Replying to{" "}
              <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "600" }}>
                @{replyingTo.username}
              </Text>
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close" size={16} color={Colors.muted.DEFAULT} />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          {/* Current-user avatar */}
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: Colors.surface[300],
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
              overflow: "hidden",
            }}
          >
            {currentUserAvatar ? (
              <Image source={{ uri: currentUserAvatar }} style={{ width: 34, height: 34 }} />
            ) : (
              <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "bold", fontSize: 13 }}>
                {avatarLetter(currentUsername)}
              </Text>
            )}
          </View>

          {/* Text input */}
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.surface[200],
              borderWidth: 1,
              borderColor: Colors.surface[400],
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              marginRight: comment.trim().length > 0 ? 10 : 0,
            }}
          >
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
              placeholderTextColor={Colors.muted.DEFAULT}
              style={{ color: "white", fontSize: 14, maxHeight: 100 }}
              multiline
            />
          </View>

          {comment.trim().length > 0 && (
            <TouchableOpacity onPress={handleSubmitComment}>
              <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "700", fontSize: 14 }}>
                Post
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BottomSheet>
  );
}
