import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const SCREEN_WIDTH = Dimensions.get("window").width;
export const GRID_ITEM_SIZE = (SCREEN_WIDTH - 2) / 3; // 2px total for 2 gaps between 3 columns

/**
 * Shared grid thumbnail tile used in profile and user-profile screens.
 *
 * Props:
 *   item    – post object { $id, type, source, thumbnail }
 *   index   – position in the list (used to compute left margin)
 *   onPress – (item) => void  called when the tile is tapped
 */
export default function ProfileGridItem({ item, index, onPress }) {
  const isVideo = item.type?.includes("video");
  const uri = item.source?.replace("/preview", "/view");
  const marginLeft = index % 3 !== 0 ? 1 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{ width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, marginLeft, marginBottom: 1 }}
      onPress={() => onPress(item)}
    >
      {isVideo ? (
        item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.fill}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={40} color="rgba(77,166,255,0.85)" />
          </View>
        )
      ) : (
        <Image source={{ uri }} style={styles.fill} resizeMode="cover" />
      )}
      {isVideo && (
        <View style={styles.videoIcon}>
          <Ionicons name="play-circle" size={18} color="rgba(255,255,255,0.85)" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0A1628",
    justifyContent: "center",
    alignItems: "center",
  },
  videoIcon: { position: "absolute", top: 6, right: 6 },
});
