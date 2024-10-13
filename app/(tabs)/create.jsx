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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]?.fileSize >= 52428800) {
      Alert.alert("File size cannot exceed 50MB");
    } else if (!result.canceled) {
      setInput((state) => ({ ...state, media: result.assets[0] }));
    }
  };

  const onSubmit = async () => {
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
    } catch (e) {
      Alert.alert(e);
    } finally {
      setUploading(false);
      Alert.alert("Post successfully created");
      setInput({ title: "", description: "", media: null });
      router.push("/home");
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
            <MaterialIcons name="perm-media" size={82} color="yellow" />
          )}
        </View>
        <View className="pt-2 pb-1">
          <Text className="color-white">or use camera</Text>
          <ComponentButton
            title="Use Camera"
            buttonStyles="bg-secondary-700"
            onPress={(ev) => console.log("Use Camera clicked")}
            platitleceholder="Use Camera"
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
