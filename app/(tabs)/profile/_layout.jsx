import { Drawer } from "expo-router/drawer";
import {
  Text,
  Pressable,
  View,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../../../context/UserContext";
import { router } from "expo-router";
import React from "react";
import { signOut } from "../../../lib/appwrite";
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileLayout() {
  const { user, handleSaveUser } = React.useContext(UserContext);

  const logout = async () => {
    await signOut();
    handleSaveUser(null);
    router.replace("/signin");
  };

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={logout} />
      )}
      screenOptions={{
        drawerType: "slide",
        drawerPosition: "right",
        drawerStyle: {
          width: "75%",
          backgroundColor: "#050D1A",
        },
        drawerActiveTintColor: "#4DA6FF",
        drawerInactiveTintColor: "#4A6080",
        drawerActiveBackgroundColor: "#132040",
        drawerInactiveBackgroundColor: "#0C1929",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        headerStyle: {
          backgroundColor: "#0C1929",
        },
        headerTitleStyle: {
          color: "#4DA6FF",
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerShown: false,
          title: user?.username ?? "Profile",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          headerShown: false,
          title: "About",
        }}
      />
      <Drawer.Screen
        name="edit"
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Edit Profile",
        }}
      />
    </Drawer>
  );
}

const NAV_ITEMS = [
  { name: "index",    label: "Profile",  icon: "person-outline",              iconActive: "person" },
  { name: "settings", label: "Settings", icon: "settings-outline",            iconActive: "settings" },
  { name: "about",    label: "About",    icon: "information-circle-outline",  iconActive: "information-circle" },
];

function CustomDrawerContent({ navigation, state, onLogout }) {
  const { user } = React.useContext(UserContext);
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
    >
      {/* User profile at top of drawer */}
      <View className="px-5 pt-14 pb-5 items-center">
        <View className="w-[72px] h-[72px] rounded-full border-2 border-secondary overflow-hidden mb-3">
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} className="w-full h-full" />
          ) : (
            <View className="flex-1 bg-primary-200 items-center justify-center">
              <Ionicons name="person" size={28} color="#4DA6FF" />
            </View>
          )}
        </View>
        <Text className="text-[17px] font-bold text-slate-200 mb-1" numberOfLines={1}>
          {user?.username ?? ""}
        </Text>
        {!!user?.bio && (
          <Text className="text-[13px] text-[#6B8CAE] text-center leading-[18px]" numberOfLines={2}>
            {user.bio}
          </Text>
        )}
      </View>

      <View className="h-px bg-primary-300 mx-5 my-3" />

      {/* Nav items */}
      <View className="px-3">
        {NAV_ITEMS.map(({ name, label, icon, iconActive }) => {
          const isActive = activeRouteName === name;
          return (
            <Pressable key={name} onPress={() => navigation.navigate(name)}>
              <View className={`flex-row items-center p-3.5 rounded-[10px] border mb-2 ${isActive ? 'bg-primary-200 border-secondary' : 'bg-primary-100 border-primary-300'}`}>
                <View className="w-6 items-center mr-3">
                  <Ionicons
                    name={isActive ? iconActive : icon}
                    size={20}
                    color={isActive ? "#4DA6FF" : "#8AAAC8"}
                  />
                </View>
                <Text className={`flex-1 text-[15px] font-medium ${isActive ? 'text-secondary font-semibold' : 'text-[#8AAAC8]'}`}>
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Logout */}
      <View className="px-3 mt-auto">
        <View className="h-px bg-primary-300 mx-5 my-3" />
        <Pressable onPress={onLogout}>
          <View className="flex-row items-center p-3.5 rounded-[10px] bg-[#1A0A0A] border border-[#4A1010]">
            <View className="w-6 items-center mr-3">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text className="text-[15px] text-red-500 font-semibold">Log Out</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
