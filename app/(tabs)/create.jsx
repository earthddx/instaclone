import React from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import ComponentVideo from "../../components/ComponentVideo";
import ComponentImage from "../../components/ComponentImage";
import { uploadFile, createPost } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const TITLE_MAX = 60;
const DESC_MAX = 300;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function Create() {
  const { user } = React.useContext(UserContext);
  const [uploading, setUploading] = React.useState(false);
  const [input, setInput] = React.useState({ title: "", description: "", media: null });
  const { title, description, media } = input;

  const handleMediaResult = (result) => {
    if (result.canceled) return;
    if (result.assets[0]?.fileSize >= MAX_FILE_SIZE) {
      Alert.alert("File too large", "Please choose a file smaller than 50MB.");
    } else {
      setInput((s) => ({ ...s, media: result.assets[0] }));
    }
  };

  const openMediaPicker = () => {
    Alert.alert("Add Media", "Choose a source", [
      {
        text: "Photo / Video Library",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            videoExportPreset: ImagePicker.VideoExportPreset.H264_1920x1080,
          });
          handleMediaResult(result);
        },
      },
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission required", "Camera access is needed to use this feature.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            videoExportPreset: ImagePicker.VideoExportPreset.H264_1920x1080,
          });
          handleMediaResult(result);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removeMedia = () => setInput((s) => ({ ...s, media: null }));

  const onSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please add a title for your post.");
      return;
    }
    if (!media) {
      Alert.alert("Missing media", "Please add a photo or video to your post.");
      return;
    }
    try {
      setUploading(true);
      const { fileViewUrl, type } = await uploadFile({ file: media });

      let thumbnailUrl = null;
      if (media.type === "video") {
        try {
          const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(media.uri, { time: 0 });
          const { fileViewUrl: thumbViewUrl } = await uploadFile({
            file: { uri: thumbUri, mimeType: "image/jpeg", type: "image", fileName: "thumb.jpg", fileSize: 0 },
          });
          thumbnailUrl = thumbViewUrl;
        } catch (e) {
          console.warn("Thumbnail generation failed, skipping:", e);
        }
      }

      await createPost({
        file: fileViewUrl,
        title: title.trim(),
        type,
        description: description.trim(),
        userId: user.$id,
        thumbnail: thumbnailUrl,
      });
      setInput({ title: "", description: "", media: null });
      Alert.alert("Posted!", "Your post is now live.", [
        { text: "OK", onPress: () => router.push("/home") },
      ]);
    } catch (e) {
      Alert.alert("Upload failed", e.message);
    } finally {
      setUploading(false);
    }
  };

  const canSubmit = title.trim().length > 0 && !!media && !uploading;

  return (
    <SafeAreaView className="bg-primary-100 flex-1" edges={["right", "top", "left"]}>
      {/* ── Header ── */}
      <View className="px-4 py-3 border-b border-primary-300 flex-row items-center">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
            <MaterialIcons name="post-add" size={16} color="#4DA6FF" />
          </View>
          <Text className="text-white text-lg font-bold">New Post</Text>
        </View>
        <View className="flex-1" />
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          className={`px-5 h-8 rounded-full items-center justify-center ${canSubmit ? "bg-highlight" : "bg-primary-300"}`}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className={`font-semibold text-sm ${canSubmit ? "text-white" : "text-gray-500"}`}>
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Body ── */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* ── Media zone ── */}
          {media ? (
            <View>
              {media.type === "image" ? (
                <ComponentImage source={media.uri} />
              ) : (
                <ComponentVideo source={media.uri} isVisible />
              )}
              {/* Overlay: swap / remove */}
              <View
                style={{ position: "absolute", top: 12, right: 12, flexDirection: "row", gap: 8 }}
              >
                <TouchableOpacity
                  onPress={openMediaPicker}
                  className="bg-black/60 rounded-full p-2"
                >
                  <MaterialIcons name="swap-horiz" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={removeMedia}
                  className="bg-black/60 rounded-full p-2"
                >
                  <MaterialIcons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={openMediaPicker}
              className="mx-4 mt-5 bg-primary-200 rounded-2xl items-center justify-center py-14"
              style={{ borderWidth: 2, borderStyle: "dashed", borderColor: "#1A3060" }}
            >
              <View className="bg-primary-300 rounded-full p-4 mb-3">
                <MaterialIcons name="add-photo-alternate" size={40} color="#1A6EEB" />
              </View>
              <Text className="text-white font-semibold text-base">Add Photo or Video</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Tap to choose from library or camera
              </Text>
              <Text className="text-gray-600 text-xs mt-3">Max 50MB · JPEG, PNG, MP4, MOV</Text>
            </Pressable>
          )}

          {/* ── Form ── */}
          <View className="px-4 mt-5">
            {/* Title */}
            <View className="mb-4">
              <View className="flex-row justify-between items-baseline mb-1">
                <Text className="text-gray-300 text-sm font-medium">
                  Title <Text className="text-red-400">*</Text>
                </Text>
                <Text
                  className={`text-xs ${title.length > TITLE_MAX * 0.85 ? "text-red-400" : "text-gray-600"}`}
                >
                  {title.length}/{TITLE_MAX}
                </Text>
              </View>
              <View className="border border-primary-300 bg-primary-200 rounded-2xl px-4 py-3">
                <TextInput
                  className="text-white text-base"
                  value={title}
                  onChangeText={(v) => {
                    if (v.length <= TITLE_MAX) setInput((s) => ({ ...s, title: v }));
                  }}
                  placeholder="Give your post a title…"
                  placeholderTextColor="#4A6080"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Description */}
            <View>
              <View className="flex-row justify-between items-baseline mb-1">
                <Text className="text-gray-300 text-sm font-medium">Description</Text>
                <Text
                  className={`text-xs ${description.length > DESC_MAX * 0.85 ? "text-red-400" : "text-gray-600"}`}
                >
                  {description.length}/{DESC_MAX}
                </Text>
              </View>
              <View className="border border-primary-300 bg-primary-200 rounded-2xl px-4 py-3">
                <TextInput
                  className="text-white text-base"
                  value={description}
                  onChangeText={(v) => {
                    if (v.length <= DESC_MAX) setInput((s) => ({ ...s, description: v }));
                  }}
                  placeholder="Write a caption…"
                  placeholderTextColor="#4A6080"
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />
              </View>
            </View>
          </View>

          {/* ── Info tip (only when no media yet) ── */}
          {!media ? (
            <View className="mx-4 mt-4 bg-primary-200 rounded-xl p-3 flex-row items-start">
              <MaterialIcons name="info-outline" size={15} color="#4DA6FF" />
              <Text className="text-gray-400 text-xs ml-2 flex-1">
                A title and at least one photo or video are required before publishing.
              </Text>
            </View>
          ) : null}
        </ScrollView>
    </SafeAreaView>
  );
}
