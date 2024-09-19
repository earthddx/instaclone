import React from "react";
import { Image, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import * as ImagePicker from "expo-image-picker";
import ComponentVideo from "../../components/ComponentVideo";
import { uploadFile, createPost } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Create() {
  const { user } = React.useContext(UserContext);
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
      // aspect: [4, 3],
      // quality: 0,
    });
    if (!result.canceled && result.assets[0]?.fileSize >= 52428800) {
      Alert.alert("File size cannot exceed 50MB");
    } else if (!result.canceled) {
      setInput((state) => ({ ...state, media: result.assets[0] }));
    }
  };

  const onSubmit = async () => {
    try {
      const fileViewUrl = await uploadFile({ file: media });
      await createPost({
        file: fileViewUrl,
        title,
        description,
        userId: user.$id,
      });
    } catch (e) {
      Alert.alert(e);
    } finally {
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
      <View>
        <Text className="text-highlight p-2">Create post</Text>
      </View>
      <View>
        <ComponentButton title="Select..." onPress={pickImage} />
      </View>
      <View>
        <ComponentInput
          onChangeText={(ev) => setInput((state) => ({ ...state, title: ev }))}
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
      <View className="flex-1 items-center justify-center border-2 p-2 border-green-400 rounded-lg">
        {media ? (
          media?.type === "image" ? (
            <Image source={{ uri: media.uri }} className="w-[100%] h-[100%]" />
          ) : (
            <ComponentVideo link={media?.uri} useNativeControls />
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
        <ComponentButton title="Create post" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}
