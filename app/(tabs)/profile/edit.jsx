import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#4DA6FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={8}>
          {saving ? (
            <ActivityIndicator size="small" color="#4DA6FF" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {/* Avatar picker */}
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={40} color="#4DA6FF" />
              </View>
            )}
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoLabel}>Change photo</Text>

          {/* Bio input */}
          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Write something about yourself…"
              placeholderTextColor="#4A6080"
              multiline
              maxLength={250}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/250</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1A3060",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  saveText: {
    color: "#4DA6FF",
    fontSize: 15,
    fontWeight: "700",
  },
  body: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4DA6FF",
    overflow: "visible",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#132040",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4DA6FF",
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0C1929",
  },
  changePhotoLabel: {
    color: "#4DA6FF",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 32,
  },
  field: {
    width: "100%",
  },
  label: {
    color: "#8AAAC8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bioInput: {
    backgroundColor: "#132040",
    borderWidth: 1,
    borderColor: "#2A4080",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    padding: 12,
    minHeight: 100,
    lineHeight: 20,
  },
  charCount: {
    color: "#4A6080",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
});
