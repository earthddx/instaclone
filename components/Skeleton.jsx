import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { GRID_ITEM_SIZE } from "./ProfileGridItem";
import Colors from "../constants/colors";

// ─── Base pulsing block ───────────────────────────────────────────────────────

export function Pulse({ style }) {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 850, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { backgroundColor: Colors.skeleton, borderRadius: 6 },
        animStyle,
        style,
      ]}
    />
  );
}

// ─── MediaCard skeleton ───────────────────────────────────────────────────────

export function SkeletonMediaCard() {
  return (
    <View
      style={{
        backgroundColor: Colors.primary[200],
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.primary[300],
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Pulse style={{ width: 36, height: 36, borderRadius: 18 }} />
        <View style={{ marginLeft: 10, flex: 1, gap: 6 }}>
          <Pulse style={{ width: 110, height: 11 }} />
          <Pulse style={{ width: 70, height: 9 }} />
        </View>
      </View>

      {/* Media area */}
      <Pulse style={{ width: "100%", aspectRatio: 1, borderRadius: 0 }} />

      {/* Action bar */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: 4,
          gap: 16,
        }}
      >
        <Pulse style={{ width: 52, height: 22 }} />
        <Pulse style={{ width: 52, height: 22 }} />
      </View>

      {/* Title + description */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 6,
          paddingBottom: 14,
          gap: 8,
        }}
      >
        <Pulse style={{ width: "55%", height: 12 }} />
        <Pulse style={{ width: "80%", height: 11 }} />
      </View>
    </View>
  );
}

// ─── Profile bio skeleton ─────────────────────────────────────────────────────

export function SkeletonProfileBio({ showButtons = false }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 12,
        backgroundColor: Colors.primary[100],
      }}
    >
      {/* Avatar + stats row */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <Pulse style={{ width: 86, height: 86, borderRadius: 43 }} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ alignItems: "center", gap: 6 }}>
              <Pulse style={{ width: 28, height: 16 }} />
              <Pulse style={{ width: 48, height: 10 }} />
            </View>
          ))}
        </View>
      </View>

      {/* Username */}
      <Pulse style={{ width: 130, height: 13, marginBottom: 10 }} />

      {/* Bio lines */}
      <Pulse style={{ width: "88%", height: 11, marginBottom: 6 }} />
      <Pulse
        style={{ width: "65%", height: 11, marginBottom: showButtons ? 14 : 6 }}
      />

      {/* Action buttons */}
      {showButtons && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pulse style={{ flex: 1, height: 34, borderRadius: 8 }} />
          <Pulse style={{ flex: 1, height: 34, borderRadius: 8 }} />
        </View>
      )}
    </View>
  );
}

// ─── Grid skeleton ────────────────────────────────────────────────────────────

export function SkeletonGrid({ count = 9 }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {Array.from({ length: count }).map((_, i) => (
        <Pulse
          key={i}
          style={{
            width: GRID_ITEM_SIZE,
            height: GRID_ITEM_SIZE,
            marginLeft: i % 3 !== 0 ? 1 : 0,
            marginBottom: 1,
            borderRadius: 0,
          }}
        />
      ))}
    </View>
  );
}
