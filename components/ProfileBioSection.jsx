import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const StatItem = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value ?? "–"}</Text>
    <Text style={styles.statLabel}>{label}</Text>
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
export default function ProfileBioSection({ profile, postsCount, children }) {
  return (
    <View style={styles.bioContainer}>
      {/* Avatar + stats */}
      <View style={styles.avatarStatsRow}>
        <View style={styles.avatarRing}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={34} color="#4DA6FF" />
            </View>
          )}
        </View>
        <View style={styles.statsRow}>
          <StatItem value={postsCount} label="Posts" />
          <StatItem value={0} label="Followers" />
          <StatItem value={0} label="Following" />
        </View>
      </View>

      {/* Username + bio */}
      <Text style={styles.displayName} numberOfLines={1}>
        {profile?.username ?? ""}
      </Text>
      {!!profile?.bio && (
        <Text style={styles.bioText} numberOfLines={4}>
          {profile.bio}
        </Text>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bioContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#0C1929",
  },
  avatarStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: "#4DA6FF",
    overflow: "hidden",
    marginRight: 24,
  },
  avatar: { width: "100%", height: "100%" },
  avatarFallback: {
    flex: 1,
    backgroundColor: "#132040",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statValue: { color: "#fff", fontSize: 17, fontWeight: "700" },
  statLabel: { color: "#999", fontSize: 12, marginTop: 2 },
  displayName: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 2 },
  bioText: { color: "#ccc", fontSize: 13, lineHeight: 18, marginBottom: 8 },
});
