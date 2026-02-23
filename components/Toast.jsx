import React from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import ToastContext from "../context/ToastContext";
import Colors from "../constants/colors";

const TYPE_CONFIG = {
  success: { color: Colors.success,          icon: "checkmark-circle" },
  error:   { color: Colors.error,            icon: "alert-circle" },
  info:    { color: Colors.secondary.DEFAULT, icon: "information-circle" },
};

export default function Toast() {
  const { toast } = React.useContext(ToastContext);
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (toast.visible) {
      translateY.value = withSpring(0, { damping: 22, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 180 });
    } else {
      translateY.value = withTiming(80, { duration: 230 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [toast.visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const config = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.success;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          bottom: insets.bottom + 72,
          left: 16,
          right: 16,
          backgroundColor: Colors.surface.DEFAULT,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 11,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 10,
          borderLeftWidth: 4,
          borderLeftColor: config.color,
          zIndex: 9999,
        },
        animStyle,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={20}
        color={config.color}
        style={{ marginRight: 10 }}
      />
      <Text style={{ color: "#fff", fontSize: 14, flex: 1, lineHeight: 20 }}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}
