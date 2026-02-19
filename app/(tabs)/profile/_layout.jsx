import { Drawer } from "expo-router/drawer";
import {
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
  };

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={logout} />
      )}
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
          title: "Profile",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: "About",
        }}
      />
    </Drawer>
  );
}

function CustomDrawerContent({ navigation, onLogout }) {
  return (
    <ScrollView style={styles.drawerContainer} contentContainerStyle={styles.drawerContentContainer}>
      {/* Render Navigation Links */}
      <View style={styles.navigationLinks}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('index')}
        >
          <Text style={styles.drawerText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('settings')}
        >
          <Text style={styles.drawerText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Add Logout Button */}
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={onLogout} color="#d32f2f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },
  drawerContentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  navigationLinks: {
    flex: 1,
  },
  drawerItem: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
  },
  drawerText: {
    fontSize: 18,
    color: '#333',
  },
  logoutContainer: {
    marginBottom: 20,
  },
});
