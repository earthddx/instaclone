import { View, Text, TextInput } from "react-native";
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
  return (
    <View className="bg-primary-200 rounded-xl mt-4 mb-2 mx-4 overflow-hidden">
      {type.includes("image") ? (
        <ComponentImage {...props} source={source} />
      ) : (
        <ComponentVideo
          {...props}
          source={source}
          allowsFullscreen
          allowsPictureInPicture
          isVisible={isVisible}
        />
      )}
      <View className="px-3 pt-2 pb-1">
        <Text className="text-white text-base font-semibold">{title}</Text>
        <Text className="text-secondary text-sm mt-0.5">@{creator}</Text>
        {description ? (
          <Text className="text-gray-400 text-sm mt-1">{description}</Text>
        ) : null}
      </View>
      <TextInput
        placeholder="Add a comment..."
        placeholderTextColor="#4A6080"
        className="text-white text-sm px-3 py-3 border-t border-primary-300"
      />
    </View>
  );
};
