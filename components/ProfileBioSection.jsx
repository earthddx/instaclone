import React from "react";
import { View, Text, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pulse } from "./Skeleton";
import Colors from "../constants/colors";

const StatItem = ({ value, label }) => (
  <View className="items-center">
    {value == null
      ? <Pulse style={{ width: 28, height: 16, borderRadius: 4, marginBottom: 4 }} />
      : <Text className="text-white text-[17px] font-bold">{value}</Text>
    }
    <Text className="text-muted-100 text-xs mt-0.5">{label}</Text>
  </View>
);

/**
 * Shared profile bio block: avatar ring + stats row + username + bio.
 *
 * Props:
 *   profile     – object with { avatar, username, bio }
 *   postsCount  – number shown in the Posts stat
 *   children    – optional JSX rendered below the bio text (e.g. action buttons, divider)
 */
export default function ProfileBioSection({ profile, postsCount, followersCount, followingCount, children }) {
  return (
    <View className="px-4 pt-[14px] pb-3 bg-primary-100">
      {/* Avatar + stats */}
      <View className="flex-row items-center mb-3">
        <View className="w-[86px] h-[86px] rounded-full border-2 border-secondary overflow-hidden mr-6">
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} className="w-full h-full" />
          ) : (
            <View className="flex-1 bg-primary-200 items-center justify-center">
              <Ionicons name="person" size={34} color={Colors.secondary.DEFAULT} />
            </View>
          )}
        </View>
        <View className="flex-1 flex-row justify-around">
          <StatItem value={postsCount} label="Posts" />
          <StatItem value={followersCount ?? 0} label="Followers" />
          <StatItem value={followingCount ?? 0} label="Following" />
        </View>
      </View>

      {/* Username + bio */}
      <Text className="text-white text-sm font-bold mb-0.5" numberOfLines={1}>
        {profile?.username ?? ""}
      </Text>
      {!!profile?.bio && (
        <Text className="text-[#ccc] text-[13px] leading-[18px] mb-2" numberOfLines={4}>
          {profile.bio}
        </Text>
      )}

      {children}
    </View>
  );
}
