import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { getFollowersList, getFollowingList } from "../lib/appwrite";
import Colors from "../constants/colors";
import BottomSheet from "./BottomSheet";

/**
 * Bottom sheet that lists followers or following users.
 *
 * Props:
 *   visible        – boolean
 *   onClose        – () => void
 *   type           – "followers" | "following"
 *   userId         – the profile's user document $id to query against
 *   currentUserId  – logged-in user's $id (routes own profile correctly)
 */
export default function FollowListSheet({ visible, onClose, type, userId, currentUserId }) {
  const router = useRouter();
  const sheetRef = React.useRef();

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch list whenever the sheet opens
  React.useEffect(() => {
    if (!visible || !userId) return;
    setLoading(true);
    setUsers([]);
    const fetch = type === "followers" ? getFollowersList : getFollowingList;
    fetch(userId)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [visible, userId, type]);

  const handleUserPress = (user) => {
    sheetRef.current?.close(() => {
      if (user.$id === currentUserId) {
        router.push("/(tabs)/profile");
      } else {
        router.push(`/user/${user.$id}`);
      }
    });
  };

  const title = type === "followers" ? "Followers" : "Following";

  return (
    <BottomSheet
      ref={sheetRef}
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseBtn
    >
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={Colors.secondary.DEFAULT} />
        </View>
      ) : users.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Ionicons name="people-outline" size={40} color={Colors.muted.DEFAULT} />
          <Text style={{ color: Colors.muted.DEFAULT, fontSize: 14 }}>
            {type === "followers" ? "No followers yet" : "Not following anyone yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              onPress={() => handleUserPress(item)}
              activeOpacity={0.65}
            >
              {/* Avatar */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  overflow: "hidden",
                  marginRight: 12,
                  backgroundColor: Colors.primary[200],
                  borderWidth: 1,
                  borderColor: Colors.secondary[300],
                }}
              >
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={{ width: 44, height: 44 }} />
                ) : (
                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="person" size={20} color={Colors.secondary.DEFAULT} />
                  </View>
                )}
              </View>

              {/* Username */}
              <Text
                style={{ flex: 1, color: "white", fontSize: 14, fontWeight: "600" }}
                numberOfLines={1}
              >
                {item.username}
              </Text>

              <Ionicons name="chevron-forward" size={16} color={Colors.muted.DEFAULT} />
            </TouchableOpacity>
          )}
        />
      )}
    </BottomSheet>
  );
}
