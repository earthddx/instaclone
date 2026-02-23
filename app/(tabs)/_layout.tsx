import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import Colors from "../../constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: Colors.secondary.DEFAULT,
        tabBarInactiveTintColor: Colors.muted[200],
        tabBarStyle: {
          backgroundColor: Colors.primary.DEFAULT,
          borderTopColor: Colors.primary[300],
          height: 85,
          paddingBottom: 28,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28} name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "create" : "create-outline"} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
