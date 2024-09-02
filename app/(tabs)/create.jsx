import { Image, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  const [input, setInput] = React.useState({
    title: "",
    description: "",
    media: null,
  });
  const { title, description, media } = input;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      <View>
        <Text className="text-highlight">Create a post</Text>
      </View>
      <View>
        <ComponentButton title="Select..." onPress={pickImage} />
      </View>
      <View>
        <ComponentInput
          placeholder="Title"
          onChangeText={(ev) => setInput((state) => ({ ...state, title: ev }))}
        />
      </View>
      <View>
        <ComponentInput
          placeholder="Description"
          onChangeText={(ev) =>
            setInput((state) => ({ ...state, description: ev }))
          }
        />
      </View>
      <View className="flex-1 items-center justify-center">
        {media.type === "image" ? (
          <Image source={{ uri: media }} className="w-[200px] h-[200px]" />
        ) : (
          <VideoView className="w-full h-64 rounded-2xl" useNativeControls />
        )}
      </View>
    </SafeAreaView>
  );
}
