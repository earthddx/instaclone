import { Drawer } from "expo-router/drawer";
import {
  Text,
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

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={logout} />
      )}
      screenOptions={{
        drawerType: "slide",
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

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  drawerContentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  navigationLinks: {
    flex: 1,
  },
  drawerItem: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#132040',
    borderWidth: 1,
    borderColor: '#1A3060',
  },
  drawerText: {
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  logoutContainer: {
    marginBottom: 20,
  },
  logoutButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#1A0A0A',
    borderWidth: 1,
    borderColor: '#4A1010',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});
