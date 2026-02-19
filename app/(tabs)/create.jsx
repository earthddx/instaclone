import React from "react";
import { Image, View, Text, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import * as ImagePicker from "expo-image-picker";
import ComponentVideo from "../../components/ComponentVideo";
import { uploadFile, createPost } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ComponentImage from "../../components/ComponentImage";

export default function Create() {
  const { user } = React.useContext(UserContext);
  const [uploading, setUploading] = React.useState(false);
  const [input, setInput] = React.useState({
    title: "",
    description: "",
    media: null,
  });
  const { title, description, media } = input;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]?.fileSize >= 52428800) {
      Alert.alert("Error", "File size cannot exceed 50MB");
    } else if (!result.canceled) {
      setInput((state) => ({ ...state, media: result.assets[0] }));
    }
  };

  const useCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed to use this feature.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]?.fileSize >= 52428800) {
      Alert.alert("Error", "File size cannot exceed 50MB");
    } else if (!result.canceled) {
      setInput((state) => ({ ...state, media: result.assets[0] }));
    }
  };

  const onSubmit = async () => {
    if (!title) {
      Alert.alert("Validation", "Please enter a title.");
      return;
    }
    if (!media) {
      Alert.alert("Validation", "Please select a media file.");
      return;
    }
    try {
      setUploading(true);
      const { fileViewUrl, type } = await uploadFile({ file: media });
      await createPost({
        file: fileViewUrl,
        title,
        type,
        description,
        userId: user.$id,
      });
      setInput({ title: "", description: "", media: null });
      Alert.alert("Success", "Post successfully created");
      router.push("/home");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      <ScrollView className="px-4 my-6">
        <View>
          <Text className="text-highlight p-2">Create post</Text>
        </View>
        <View>
          <ComponentButton title="Select..." onPress={pickImage} />
        </View>
        <View>
          <ComponentInput
            onChangeText={(ev) =>
              setInput((state) => ({ ...state, title: ev }))
            }
            placeholder="Title"
            value={title}
          />
        </View>
        <View>
          <ComponentInput
            onChangeText={(ev) =>
              setInput((state) => ({ ...state, description: ev }))
            }
            placeholder="Description"
            value={description}
          />
        </View>
        <View className="border-2 p-2 border-green-400 rounded-lg">
          {media ? (
            media?.type === "image" ? (
              <ComponentImage source={media?.uri} />
            ) : (
              <ComponentVideo source={media?.uri} />
            )
          ) : (
            <View className="items-center">
              <MaterialIcons name="perm-media" size={220} color="yellow" />
            </View>
          )}
        </View>
        <View className="pt-2 pb-1">
          <Text className="color-white">or use camera</Text>
          <ComponentButton
            title="Use Camera"
            buttonStyles="bg-secondary-700"
            onPress={useCamera}
            textStyles="color-white"
          />
        </View>
        <View>
          <ComponentButton
            isLoading={uploading}
            title="Create post"
            onPress={onSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
