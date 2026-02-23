import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";

export default function EllipsisMenu({ visible, top, right, hidden, onToggleHidden, onClose, onDelete }) {
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
            backgroundColor: Colors.surface.DEFAULT,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.surface[300],
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
              color={Colors.muted[300]}
            />
            <Text style={{ color: "white", fontSize: 14 }}>
              {hidden ? "Show post" : "Hide post"}
            </Text>
          </TouchableOpacity>

          {onDelete && (
            <>
              <View style={{ height: 0.5, backgroundColor: Colors.surface[300] }} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { onClose(); onDelete(); }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  gap: 10,
                }}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                <Text style={{ color: Colors.danger, fontSize: 14 }}>Delete post</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
