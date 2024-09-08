import React from "react";
import { Image, View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ImagePicker from "expo-image-picker";
import ComponentVideo from "../../components/ComponentVideo";
import { uploadFile } from "../../lib/appwrite";
import { getLoggedInUser } from "../../lib/appwrite";

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
      mediaTypes: [ImagePicker.MediaTypeOptions.Images, ImagePicker.MediaTypeOptions.Videos],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setInput((state) => ({ ...state, media: result.assets[0] }));
    }
  };

  const createPost = async () => {
    try {
      await uploadFile({ file: media });
    } catch (e) {
      Alert.alert(e);
    } finally {
      //create post
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
      <View className="flex-1">
        {media?.type === "image" ? (
          <Image source={{ uri: media.uri }} className="w-[200px] h-[200px]" />
        ) : (
          <ComponentVideo
            className="w-full h-64 rounded-2xl"
            link={media?.uri}
            useNativeControls
          />
        )}
      </View>
      <View>
        <ComponentButton title="Create post" onPress={createPost} />
      </View>
    </SafeAreaView>
  );
}
