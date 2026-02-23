import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
  ActivityIndicator,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getComments, addComment } from "../lib/appwrite";
import Colors from "../constants/colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.78;
const DISMISS_THRESHOLD = 120;

const avatarLetter = (name) => name?.[0]?.toUpperCase() ?? "?";

const CommentItem = ({ item, onAvatarPress, onReplyPress, replyCount, isExpanded, onToggleReplies }) => {
  return (
    <View>
      <View style={{ flexDirection: "row", marginBottom: 6, alignItems: "flex-start" }}>
        <TouchableOpacity
          onPress={() => onAvatarPress(item.userId)}
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
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={{ width: 36, height: 36 }} />
          ) : (
            <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "bold", fontSize: 14 }}>
              {avatarLetter(item.username)}
            </Text>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 13, lineHeight: 19 }}>
            <Text style={{ fontWeight: "700" }}>@{item.username}{" "}</Text>
            {item.text}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3, gap: 12 }}>
            <Text style={{ color: Colors.muted.DEFAULT, fontSize: 11 }}>
              {new Date(item.$createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <TouchableOpacity onPress={() => onReplyPress(item.$id, item.username)}>
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
        onPress={() => onAvatarPress(item.userId)}
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
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={{ width: 28, height: 28 }} />
        ) : (
          <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "bold", fontSize: 11 }}>
            {avatarLetter(item.username)}
          </Text>
        )}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontSize: 12, lineHeight: 17 }}>
          <Text style={{ fontWeight: "700" }}>@{item.username}{" "}</Text>
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
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  // Keep onClose in a ref so the panResponder closure always calls the latest version
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const keyboardPadding = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;

  // Keyboard-driven bottom padding
  React.useEffect(() => {
    keyboardPadding.setValue(insets.bottom);
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: e.endCoordinates.height,
        duration: e.duration ?? 250,
        useNativeDriver: false,
      }).start();
    });
    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: insets.bottom,
        duration: e.duration ?? 250,
        useNativeDriver: false,
      }).start();
    });

    return () => { onShow.remove(); onHide.remove(); };
  }, [insets.bottom]);

  const openSheet = () => {
    translateY.setValue(SHEET_HEIGHT);
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
  };

  const closeSheet = (callback) => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setComment("");
      setReplyingTo(null);
      setExpandedComments(new Set());
      onCloseRef.current();
      callback?.();
    });
  };

  const handleNavigateToUser = (userId) => {
    if (!userId) return;
    closeSheet(() => {
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
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 2,
      onPanResponderMove: (_, { dy }) => { if (dy > 0) translateY.setValue(dy); },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > 0.8) {
          closeSheet();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
        }
      },
    })
  ).current;

  // Open animation + fetch comments whenever the sheet becomes visible
  React.useEffect(() => {
    if (!visible) return;
    openSheet();
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
        username: currentUsername,
        avatar: currentUserAvatar,
        text,
        parentId,
      });
      setComments((prev) => {
        const next = [...prev, newComment];
        onCommentCountChange?.(next.length);
        return next;
      });
      // Auto-expand the parent thread so the new reply is visible
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
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={() => closeSheet()}
    >
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          activeOpacity={1}
          onPress={() => closeSheet()}
        />

        {/* Animated sheet */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: SHEET_HEIGHT,
            backgroundColor: Colors.surface.DEFAULT,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [{ translateY }],
          }}
        >
          <Animated.View style={{ flex: 1, paddingBottom: keyboardPadding }}>
            {/* Drag handle */}
            <View
              {...panResponder.panHandlers}
              style={{ alignItems: "center", paddingVertical: 12 }}
            >
              <View
                style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.muted.DEFAULT }}
              />
            </View>

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: Colors.surface[300],
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Comments
              </Text>
            </View>

            {/* Comment list */}
            {loadingComments ? (
              <ActivityIndicator color={Colors.secondary.DEFAULT} style={{ flex: 1, alignSelf: "center" }} />
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

            {/* Comment-added toast (inside modal, above input bar) */}
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
                    <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "600" }}>@{replyingTo.username}</Text>
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
                    <Image
                      source={{ uri: currentUserAvatar }}
                      style={{ width: 34, height: 34 }}
                    />
                  ) : (
                    <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "bold", fontSize: 13 }}>
                      {avatarLetter(currentUsername)}
                    </Text>
                  )}
                </View>
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
                  <TouchableOpacity onPress={handleSubmitComment} style={{ marginLeft: 10 }}>
                    <Text style={{ color: Colors.secondary.DEFAULT, fontWeight: "700", fontSize: 14 }}>
                      Post
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}
