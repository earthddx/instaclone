import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

//TODO: use constants/Colors instead since nativewind does not work here
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4DA6FF",
        tabBarInactiveTintColor: "#3A5070",
        tabBarStyle: {
          backgroundColor: "#050D1A",
          borderTopColor: "#1A3060",
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="create-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="message" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
          name="profile"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={28} color={color} />
            ),
          }}
        />
    </Tabs>
  );
}