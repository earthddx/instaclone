import React from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";

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
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-primary-100 justify-center items-center">
            <Ionicons name="play-circle" size={40} color={Colors.secondary.DEFAULT} />
          </View>
        )
      ) : (
        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
      )}
      {isVideo && (
        <View className="absolute top-[6px] right-[6px]">
          <Ionicons name="play-circle" size={18} color={Colors.overlay} />
        </View>
      )}
    </TouchableOpacity>
  );
}
