import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EllipsisMenu({ visible, top, right, hidden, onToggleHidden, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <View
          style={{
            position: "absolute",
            top,
            right,
            backgroundColor: "#1E2D3D",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#2a3a4a",
            minWidth: 152,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { onToggleHidden(); onClose(); }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingVertical: 13,
              gap: 10,
            }}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#8899AA"
            />
            <Text style={{ color: "white", fontSize: 14 }}>
              {hidden ? "Show post" : "Hide post"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
