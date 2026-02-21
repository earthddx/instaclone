import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import ComponentVideo from "./ComponentVideo";
import ComponentImage from "./ComponentImage";
import CommentsSheet from "./CommentsSheet";
import EllipsisMenu from "./EllipsisMenu";
import { likePost, unlikePost, getCommentCount } from "../lib/appwrite";

const WINDOW_WIDTH = Dimensions.get("window").width;

const avatarLetter = (name) => name?.[0]?.toUpperCase() ?? "?";

export default (props) => {
  const {
    $id,
    description,
    title,
    type = "image",
    source,
    creator,
    creatorAvatar,
    creatorId,
    isVisible,
    $createdAt,
    likes = [],
    currentUserId,
    currentUsername,
    currentUserAvatar,
    onDelete,
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
  const likesRef = React.useRef([...likes]);

  const [hidden, setHidden] = React.useState(false);

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuTop, setMenuTop] = React.useState(0);
  const [menuRight, setMenuRight] = React.useState(0);
  const ellipsisRef = React.useRef(null);

  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const [commentCount, setCommentCount] = React.useState(0);

  React.useEffect(() => {
    getCommentCount($id).then(setCommentCount);
  }, [$id]);

  const handleLike = async () => {
    if (!currentUserId) return;
    const wasLiked = liked;
    const snapshot = [...likesRef.current];
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    try {
      if (wasLiked) {
        likesRef.current = snapshot.filter((id) => id !== currentUserId);
        await unlikePost($id, snapshot, currentUserId);
      } else {
        likesRef.current = [...snapshot, currentUserId];
        await likePost($id, snapshot, currentUserId);
      }
    } catch {
      likesRef.current = snapshot;
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const openMenu = () => {
    ellipsisRef.current?.measureInWindow((x, y, width, height) => {
      setMenuTop(y + height + 4);
      setMenuRight(WINDOW_WIDTH - x - width);
      setMenuVisible(true);
    });
  };

  return (
    <View className="bg-primary-200 rounded-2xl mt-4 mb-2 mx-4 overflow-hidden border border-primary-300">
      <ComponentHeader
        formattedDate={formattedDate}
        creator={creator}
        creatorAvatar={creatorAvatar}
        creatorId={creatorId}
        currentUserId={currentUserId}
        ellipsisRef={ellipsisRef}
        openMenu={openMenu}
      />

      {/* Media + body — wrapped so the hidden overlay can cover them */}
      <View style={{ position: "relative" }}>
        {type.includes("image") ? (
          <ComponentImage source={source} />
        ) : (
          <ComponentVideo
            source={source}
            allowsFullscreen
            allowsPictureInPicture
            isVisible={isVisible && !hidden}
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
            onPress={() => setCommentsVisible(true)}
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
        {/* Hidden overlay */}
        {hidden && (
          <BlurView
            intensity={70}
            tint="dark"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="eye-off" size={90} color="rgba(255,255,255,0.75)" />
          </BlurView>
        )}
      </View>
      <EllipsisMenu
        visible={menuVisible}
        top={menuTop}
        right={menuRight}
        hidden={hidden}
        onToggleHidden={() => setHidden((prev) => !prev)}
        onClose={() => setMenuVisible(false)}
        onDelete={onDelete}
      />
      <CommentsSheet
        visible={commentsVisible}
        postId={$id}
        currentUserId={currentUserId}
        currentUsername={currentUsername}
        currentUserAvatar={currentUserAvatar}
        onClose={() => setCommentsVisible(false)}
        onCommentCountChange={setCommentCount}
      />
    </View>
  );
};

const ComponentHeader = ({ formattedDate, creator, creatorAvatar, creatorId, currentUserId, ellipsisRef, openMenu }) => {
  const router = useRouter();

  const handleCreatorPress = () => {
    if (!creatorId) return;
    if (creatorId === currentUserId) {
      router.push("/(tabs)/profile");
    } else {
      router.push(`/user/${creatorId}`);
    }
  };

  return <View className="flex-row items-center px-3 py-2.5">
    <TouchableOpacity
      className="flex-row items-center flex-1 mr-2"
      onPress={handleCreatorPress}
      activeOpacity={creatorId ? 0.7 : 1}
    >
      <View className="w-9 h-9 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-2.5 overflow-hidden">
        {creatorAvatar ? (
          <Image source={{ uri: creatorAvatar }} style={{ width: "100%", height: "100%" }} />
        ) : (
          <Text className="text-secondary font-bold text-sm">
            {avatarLetter(creator)}
          </Text>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-sm">@{creator}</Text>
        {formattedDate && (
          <Text className="text-gray-500 text-xs">{formattedDate}</Text>
        )}
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      ref={ellipsisRef}
      onPress={openMenu}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="ellipsis-horizontal" size={18} color="#4A6080" />
    </TouchableOpacity>
  </View>
}