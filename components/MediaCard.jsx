import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ComponentVideo from "./ComponentVideo";
import ComponentImage from "./ComponentImage";

export default (props) => {
  const {
    description,
    title,
    type = "image",
    source,
    creator,
    isVisible,
  } = props;

  const [liked, setLiked] = React.useState(false);
  const [comment, setComment] = React.useState("");

  return (
    <View className="bg-primary-200 rounded-2xl mt-4 mb-2 mx-4 overflow-hidden border border-primary-300">
      {/* Header */}
      <View className="flex-row items-center px-3 py-2.5">
        <View className="w-9 h-9 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-2.5">
          <Text className="text-secondary font-bold text-sm">
            {creator?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-white font-semibold text-sm flex-1">
          @{creator}
        </Text>
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
          onPress={() => setLiked((prev) => !prev)}
          className="flex-row items-center"
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "#FF4D6D" : "#8899AA"}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={22} color="#8899AA" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={22} color="#8899AA" />
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

      {/* Comment input */}
      <View className="flex-row items-center px-3 py-2.5 border-t border-primary-300">
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          placeholderTextColor="#4A6080"
          className="text-white text-sm flex-1"
        />
        {comment.length > 0 && (
          <TouchableOpacity
            onPress={() => setComment("")}
            className="ml-2"
          >
            <Text className="text-secondary text-sm font-semibold">Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
