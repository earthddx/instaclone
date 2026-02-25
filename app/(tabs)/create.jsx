import React from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import ComponentVideo from "../../components/ComponentVideo";
import ComponentImage from "../../components/ComponentImage";
import ComponentInput from "../../components/ComponentInput";
import { uploadFile, createPost } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../constants/colors";

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

  const openLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      videoExportPreset: ImagePicker.VideoExportPreset.H264_1920x1080,
    });
    handleMediaResult(result);
  };

  const openCamera = async () => {
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
  };

  const openMediaPicker = () => {
    Alert.alert("Change Media", "Choose a source", [
      { text: "Photo / Video Library", onPress: openLibrary },
      { text: "Camera", onPress: openCamera },
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
            <MaterialIcons name="post-add" size={16} color={Colors.secondary.DEFAULT} />
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
            <Text className={`font-semibold text-sm ${canSubmit ? "text-white" : "text-muted-DEFAULT"}`}>
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Body ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
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
            <View className="absolute top-3 right-3 flex-row gap-2">
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
          /* ── Two-card media picker ── */
          <View className="px-4 mt-5">
            <Text className="text-muted-300 text-xs font-bold uppercase tracking-[1.5px] mb-3">
              Add Media
            </Text>
            <View className="flex-row gap-3">
              {/* Library card */}
              <Pressable
                onPress={openLibrary}
                className="flex-1 rounded-2xl items-center justify-center py-8 bg-surface border border-surface-400"
              >
                <View className="rounded-full p-4 mb-3 bg-secondary-100 border border-secondary-300">
                  <MaterialIcons name="photo-library" size={32} color={Colors.secondary.DEFAULT} />
                </View>
                <Text className="text-white font-semibold text-sm">Library</Text>
                <Text className="text-muted-300 text-xs mt-1">Photo or Video</Text>
              </Pressable>

              {/* Camera card */}
              <Pressable
                onPress={openCamera}
                className="flex-1 rounded-2xl items-center justify-center py-8 bg-surface border border-surface-400"
              >
                <View className="rounded-full p-4 mb-3 bg-secondary-100 border border-secondary-300">
                  <MaterialIcons name="photo-camera" size={32} color={Colors.secondary.DEFAULT} />
                </View>
                <Text className="text-white font-semibold text-sm">Camera</Text>
                <Text className="text-muted-300 text-xs mt-1">Take a shot</Text>
              </Pressable>
            </View>
            <Text className="text-muted-100 text-xs text-center mt-3">
              Max 50MB · JPEG, PNG, MP4, MOV
            </Text>
          </View>
        )}

        {/* ── Post Details section ── */}
        <View className="px-4 mt-6">
          {/* Section header with left-bar accent */}
          <View className="flex-row items-center mb-4 gap-2">
            <View className="w-[3px] h-4 bg-secondary rounded-sm" />
            <Text className="text-muted-300 text-xs font-bold uppercase tracking-[1.5px]">
              Post Details
            </Text>
          </View>

          {/* Title */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-white text-sm font-semibold">
                Title <Text className="text-error">*</Text>
              </Text>
              <View
                className={`px-2 py-0.5 rounded-full ${title.length > TITLE_MAX * 0.85 ? "bg-danger-surface" : "bg-primary-200"}`}
              >
                <Text
                  className={`text-xs font-medium ${title.length > TITLE_MAX * 0.85 ? "text-danger" : "text-muted-300"}`}
                >
                  {title.length}/{TITLE_MAX}
                </Text>
              </View>
            </View>
            <ComponentInput
              value={title}
              onChangeText={(v) => {
                if (v.length <= TITLE_MAX) setInput((s) => ({ ...s, title: v }));
              }}
              placeholder="Give your post a title…"
              returnKeyType="next"
              autoCapitalize="sentences"
            />
          </View>

          {/* Description */}
          <View>
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-white text-sm font-semibold">Caption</Text>
              <View
                className={`px-2 py-0.5 rounded-full ${description.length > DESC_MAX * 0.85 ? "bg-danger-surface" : "bg-primary-200"}`}
              >
                <Text
                  className={`text-xs font-medium ${description.length > DESC_MAX * 0.85 ? "text-danger" : "text-muted-300"}`}
                >
                  {description.length}/{DESC_MAX}
                </Text>
              </View>
            </View>
            <ComponentInput
              value={description}
              onChangeText={(v) => {
                if (v.length <= DESC_MAX) setInput((s) => ({ ...s, description: v }));
              }}
              placeholder="Write a caption…"
              multiline
              minHeight={100}
              scrollable
              autoCapitalize="sentences"
            />
          </View>
        </View>

        {/* ── Requirement hint (only when no media) ── */}
        {!media && (
          <View className="mx-4 mt-4 rounded-xl p-3 flex-row items-center bg-secondary-50 border border-secondary-300 gap-2">
            <MaterialIcons name="info-outline" size={15} color={Colors.secondary.DEFAULT} />
            <Text className="text-muted-300 text-xs flex-1">
              A title and at least one photo or video are required before publishing.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
