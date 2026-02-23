import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

export default function HomeHeader({ activeTab, onTabPress }) {
  return (
    <View className="h-14 border-b border-primary-300 flex-row">
      <View className="w-14 items-center justify-center">
        <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center">
          <Ionicons name="newspaper" size={16} color={Colors.secondary.DEFAULT} />
        </View>
      </View>

      <TouchableOpacity
        className={`flex-1 items-center justify-center ${activeTab === 0 ? "border-b-2 border-secondary" : ""}`}
        onPress={() => onTabPress(0)}
        activeOpacity={0.7}
      >
        <Text className={`text-[15px] font-semibold ${activeTab === 0 ? "text-white" : "text-muted"}`}>
          For You
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 items-center justify-center ${activeTab === 1 ? "border-b-2 border-secondary" : ""}`}
        onPress={() => onTabPress(1)}
        activeOpacity={0.7}
      >
        <Text className={`text-[15px] font-semibold ${activeTab === 1 ? "text-white" : "text-muted"}`}>
          Following
        </Text>
      </TouchableOpacity>

      <View className="w-14" />
    </View>
  );
}
