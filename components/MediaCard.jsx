import React from "react";
import {
  View,
  Text,
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ComponentVideo from "./ComponentVideo";
import ComponentImage from "./ComponentImage";
import { likePost, unlikePost, getComments, addComment, getCommentCount } from "../lib/appwrite";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.78;
const DISMISS_THRESHOLD = 120;

export default (props) => {
  const {
    $id,
    description,
    title,
    type = "image",
    source,
    creator,
    isVisible,
    $createdAt,
    likes = [],
    currentUserId,
    currentUsername,
  } = props;

  const formattedDate = $createdAt
    ? new Date($createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const [liked, setLiked] = React.useState(
    currentUserId ? likes.includes(currentUserId) : false
  );
  const [likeCount, setLikeCount] = React.useState(likes.length);
  const [comment, setComment] = React.useState("");
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [commentCount, setCommentCount] = React.useState(0);

  React.useEffect(() => {
    getCommentCount($id).then(setCommentCount);
  }, [$id]);

  const insets = useSafeAreaInsets();

  // Keyboard-driven bottom padding — animates sheet content up when keyboard opens
  const keyboardPadding = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    keyboardPadding.setValue(insets.bottom);

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

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

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [insets.bottom]);

  // Sheet slide animation
  const translateY = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const openSheet = () => {
    translateY.setValue(SHEET_HEIGHT);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeSheet = (callback) => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setCommentsVisible(false);
      translateY.setValue(SHEET_HEIGHT);
      callback?.();
    });
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 2,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > 0.8) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  const handleLike = async () => {
    if (!currentUserId) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    try {
      if (wasLiked) {
        await unlikePost($id, likes, currentUserId);
      } else {
        await likePost($id, likes, currentUserId);
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const openComments = async () => {
    setCommentsVisible(true);
    openSheet();
    setLoadingComments(true);
    try {
      const fetched = await getComments($id);
      setComments(fetched);
      setCommentCount(fetched.length);
    } catch {}
    setLoadingComments(false);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || !currentUserId) return;
    const text = comment.trim();
    setComment("");
    try {
      const newComment = await addComment({
        postId: $id,
        userId: currentUserId,
        username: currentUsername,
        text,
      });
      setComments((prev) => [...prev, newComment]);
      setCommentCount((prev) => prev + 1);
    } catch {}
  };

  const avatarLetter = (name) => name?.[0]?.toUpperCase() ?? "?";

  return (
    <View className="bg-primary-200 rounded-2xl mt-4 mb-2 mx-4 overflow-hidden border border-primary-300">
      {/* Header */}
      <View className="flex-row items-center px-3 py-2.5">
        <View className="w-9 h-9 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-2.5">
          <Text className="text-secondary font-bold text-sm">
            {avatarLetter(creator)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-sm">@{creator}</Text>
          {formattedDate && (
            <Text className="text-gray-500 text-xs">{formattedDate}</Text>
          )}
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#4A6080" />
        </TouchableOpacity>
      </View>

      {/* Media */}
      {type.includes("image") ? (
        <ComponentImage source={source} />
      ) : (
        <ComponentVideo
          source={source}
          allowsFullscreen
          allowsPictureInPicture
          isVisible={isVisible}
        />
      )}

      {/* Action bar */}
      <View className="flex-row items-center px-3 pt-3 pb-1 gap-4">
        <TouchableOpacity
          onPress={handleLike}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "#FF4D6D" : "#8899AA"}
          />
          {likeCount > 0 && (
            <Text
              className="text-sm"
              style={{ color: liked ? "#FF4D6D" : "#8899AA" }}
            >
              {likeCount}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openComments}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons name="chatbubble-outline" size={22} color="#8899AA" />
          {commentCount > 0 && (
            <Text className="text-sm" style={{ color: "#8899AA" }}>
              {commentCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Title + description */}
      <View className="px-3 pt-1 pb-2">
        {title ? (
          <Text className="text-white text-sm font-semibold">{title}</Text>
        ) : null}
        {description ? (
          <Text className="text-gray-400 text-sm mt-0.5">{description}</Text>
        ) : null}
      </View>

      {/* Add a comment — tapping opens the modal */}
      <TouchableOpacity
        onPress={openComments}
        className="flex-row items-center px-3 py-2.5 border-t border-primary-300"
      >
        <Text className="text-gray-500 text-sm flex-1">Add a comment...</Text>
      </TouchableOpacity>

      {/* Comments modal */}
      <Modal
        visible={commentsVisible}
        animationType="none"
        transparent
        onRequestClose={() => closeSheet()}
      >
        <View style={{ flex: 1 }}>
          {/* Backdrop */}
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
            activeOpacity={1}
            onPress={() => closeSheet()}
          />

          {/* Animated sheet */}
          <Animated.View
            style={{
              height: SHEET_HEIGHT,
              backgroundColor: "#1E2D3D",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              transform: [{ translateY }],
            }}
          >
            {/* Inner content — paddingBottom tracks keyboard height */}
            <Animated.View
              style={{ flex: 1, paddingBottom: keyboardPadding }}
            >
              {/* Drag handle */}
              <View
                {...panResponder.panHandlers}
                style={{ alignItems: "center", paddingVertical: 12 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#4A6080",
                  }}
                />
              </View>

              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 16,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2a3a4a",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
                >
                  Comments
                </Text>
                <TouchableOpacity
                  style={{ position: "absolute", right: 16 }}
                  onPress={() => closeSheet()}
                >
                  <Ionicons name="close" size={22} color="#8899AA" />
                </TouchableOpacity>
              </View>

              {/* Comment list */}
              {loadingComments ? (
                <ActivityIndicator
                  color="#4DA6FF"
                  style={{ flex: 1, alignSelf: "center" }}
                />
              ) : (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => item.$id}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text
                      style={{
                        color: "#4A6080",
                        textAlign: "center",
                        paddingVertical: 32,
                        fontSize: 14,
                      }}
                    >
                      No comments yet. Be the first!
                    </Text>
                  }
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 18,
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: "#2a3a4a",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#4DA6FF",
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {avatarLetter(item.username)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 13,
                            lineHeight: 19,
                          }}
                        >
                          <Text style={{ fontWeight: "700" }}>
                            @{item.username}{" "}
                          </Text>
                          {item.text}
                        </Text>
                        <Text
                          style={{
                            color: "#4A6080",
                            fontSize: 11,
                            marginTop: 3,
                          }}
                        >
                          {new Date(item.$createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}

              {/* Input bar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderTopWidth: 1,
                  borderTopColor: "#2a3a4a",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: "#2a3a4a",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#4DA6FF",
                      fontWeight: "bold",
                      fontSize: 13,
                    }}
                  >
                    {avatarLetter(currentUsername)}
                  </Text>
                </View>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Add a comment..."
                  placeholderTextColor="#4A6080"
                  style={{ flex: 1, color: "white", fontSize: 14, maxHeight: 100 }}
                  multiline
                />
                {comment.trim().length > 0 && (
                  <TouchableOpacity
                    onPress={handleSubmitComment}
                    style={{ marginLeft: 10 }}
                  >
                    <Text
                      style={{
                        color: "#4DA6FF",
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};
