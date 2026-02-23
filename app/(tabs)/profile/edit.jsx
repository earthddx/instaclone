import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { UserContext } from "../../../context/UserContext";
import { uploadFile, updateUser } from "../../../lib/appwrite";
import Colors from "../../../constants/colors";

export default function EditProfile() {
  const router = useRouter();
  const { user, handleSaveUser } = React.useContext(UserContext);

  const [bio, setBio] = React.useState(user?.bio ?? "");
  const [avatarAsset, setAvatarAsset] = React.useState(null); // local picked image
  const [saving, setSaving] = React.useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Allow photo library access to change your avatar.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setAvatarAsset(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updates = {};

      if (bio.trim() !== (user?.bio ?? "")) {
        updates.bio = bio.trim();
      }

      if (avatarAsset) {
        const { fileViewUrl } = await uploadFile({ file: avatarAsset });
        updates.avatar = fileViewUrl.toString();
      }

      if (Object.keys(updates).length === 0) {
        router.back();
        return;
      }

      const updated = await updateUser(user.$id, updates);
      handleSaveUser(updated);
      router.back();
    } catch (err) {
      console.error("[EditProfile] save error:", err);
      Alert.alert("Error", "Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const avatarUri = avatarAsset ? avatarAsset.uri : user?.avatar;

  return (
    <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b-[0.5px] border-primary-300">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={Colors.secondary.DEFAULT} />
        </TouchableOpacity>
        <Text className="text-white text-[17px] font-bold">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={8}>
          {saving ? (
            <ActivityIndicator size="small" color={Colors.secondary.DEFAULT} />
          ) : (
            <Text className="text-secondary text-[15px] font-bold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="items-center pt-8 px-6 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar picker */}
          <TouchableOpacity
            className="w-[100px] h-[100px] rounded-full border-2 border-secondary overflow-visible"
            onPress={pickAvatar}
            activeOpacity={0.8}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="w-[100px] h-[100px] rounded-full" />
            ) : (
              <View className="w-[100px] h-[100px] rounded-full bg-primary-200 items-center justify-center">
                <Ionicons name="person" size={40} color={Colors.secondary.DEFAULT} />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-secondary rounded-xl w-7 h-7 items-center justify-center border-2 border-primary-100">
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text className="text-secondary text-[13px] mt-2.5 mb-8">Change photo</Text>

          {/* Bio input */}
          <View className="w-full">
            <Text className="text-muted-300 text-[13px] font-semibold mb-2 uppercase tracking-[0.5px]">Bio</Text>
            <TextInput
              className="bg-primary-200 border border-primary-300 rounded-[10px] text-white text-sm p-3 min-h-[100px] leading-5"
              value={bio}
              onChangeText={setBio}
              placeholder="Write something about yourself…"
              placeholderTextColor={Colors.muted.DEFAULT}
              multiline
              maxLength={250}
              textAlignVertical="top"
            />
            <Text className="text-muted text-xs text-right mt-1">{bio.length}/250</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
