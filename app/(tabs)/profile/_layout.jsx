import { Drawer } from "expo-router/drawer";
import {
  Text,
  StyleSheet,
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
        name="[postId]"
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Post",
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
      style={styles.drawerContainer}
      contentContainerStyle={styles.drawerContentContainer}
    >
      {/* User profile at top of drawer */}
      <View style={styles.userHeader}>
        <View style={styles.avatarWrapper}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={28} color="#4DA6FF" />
            </View>
          )}
        </View>
        <Text style={styles.username} numberOfLines={1}>
          {user?.username ?? ""}
        </Text>
        {!!user?.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* Nav items */}
      <View style={styles.navigationLinks}>
        {NAV_ITEMS.map(({ name, label, icon, iconActive }) => {
          const isActive = activeRouteName === name;
          return (
            <Pressable key={name} onPress={() => navigation.navigate(name)}>
              <View style={[styles.drawerItem, isActive && styles.drawerItemActive]}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={isActive ? iconActive : icon}
                    size={20}
                    color={isActive ? "#4DA6FF" : "#8AAAC8"}
                  />
                </View>
                <Text style={[styles.drawerText, isActive && styles.drawerTextActive]}>
                  {label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <View style={styles.divider} />
        <Pressable onPress={onLogout}>
          <View style={styles.logoutButton}>
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerContentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  /* User header */
  userHeader: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    alignItems: "center",
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#4DA6FF",
    overflow: "hidden",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: "#132040",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 17,
    fontWeight: "700",
    color: "#E2E8F0",
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    color: "#6B8CAE",
    textAlign: "center",
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#1A3060",
    marginHorizontal: 20,
    marginVertical: 12,
  },

  /* Nav items */
  navigationLinks: {
    paddingHorizontal: 12,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#0C1929",
    borderWidth: 1,
    borderColor: "#1A3060",
    marginBottom: 8,
  },
  drawerItemActive: {
    backgroundColor: "#132040",
    borderColor: "#4DA6FF",
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  drawerText: {
    flex: 1,
    fontSize: 15,
    color: "#8AAAC8",
    fontWeight: "500",
  },
  drawerTextActive: {
    color: "#4DA6FF",
    fontWeight: "600",
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4DA6FF",
  },

  /* Logout */
  logoutContainer: {
    paddingHorizontal: 12,
    marginTop: "auto",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#1A0A0A",
    borderWidth: 1,
    borderColor: "#4A1010",
  },
  logoutText: {
    fontSize: 15,
    color: "#EF4444",
    fontWeight: "600",
  },
});
