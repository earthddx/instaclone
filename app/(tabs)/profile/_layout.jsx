import { Drawer } from "expo-router/drawer";

export default function ProfileLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerType: "slide", // Slide-in drawer
        drawerStyle: {
          width: "75%",
          backgroundColor: "#0d0d0d",
        },
        drawerActiveTintColor: "#6200ee", // Color for the active tab text/icon
        drawerInactiveTintColor: "#333", // Color for inactive tab text/icon
        drawerActiveBackgroundColor: "#e1bee7", // Background color for the active tab
        drawerInactiveBackgroundColor: "#fff", // Background color for inactive tabs
        drawerLabelStyle: {
          fontSize: 16, // Text size of drawer items
          fontWeight: "bold", // Text weight
        },
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleStyle: {
          color: "#e34ba9",
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          // headerShown: false,
          title: "Profile",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          // headerShown: false,
          title: "Settings",
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          // headerShown: false,
          title: "About",
        }}
      />
    </Drawer>
  );
}
