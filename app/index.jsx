import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import ComponentButton from "../components/ComponentButton";

export default function App() {
  const { user } = React.useContext(UserContext);

  if (user) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0C1929" style="light" />

      {/* Decorative orbs */}
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />
      <View style={styles.orbCenter} />

      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoRing}>
            <Ionicons name="camera" size={46} color="#4DA6FF" />
          </View>
          <Text style={styles.appName}>INSTACLONE</Text>
          <Text style={styles.tagline}>Share your world</Text>
        </View>

        {/* Feature pills */}
        <View style={styles.featuresRow}>
          <View style={styles.featurePill}>
            <Ionicons name="image-outline" size={15} color="#4DA6FF" />
            <Text style={styles.featureText}>Photos</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featurePill}>
            <Ionicons name="videocam-outline" size={15} color="#4DA6FF" />
            <Text style={styles.featureText}>Videos</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featurePill}>
            <Ionicons name="people-outline" size={15} color="#4DA6FF" />
            <Text style={styles.featureText}>Connect</Text>
          </View>
        </View>

        {/* CTA buttons */}
        <View style={styles.buttons}>
          <ComponentButton
            title="Sign In"
            onPress={() => router.push("/signin")}
            buttonStyles="w-full"
          />
          <Pressable
            style={({ pressed }) => [
              styles.outlineBtn,
              pressed && { opacity: 0.65 },
            ]}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.outlineBtnText}>Create an account</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2026 Instaclone</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  orbTopRight: {
    position: "absolute",
    top: -100,
    right: -70,
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: "rgba(77, 166, 255, 0.07)",
  },
  orbBottomLeft: {
    position: "absolute",
    bottom: -70,
    left: -90,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(26, 110, 235, 0.07)",
  },
  orbCenter: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(77, 166, 255, 0.04)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    gap: 40,
  },
  hero: {
    alignItems: "center",
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(77, 166, 255, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(77, 166, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  appName: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 7,
    marginBottom: 10,
  },
  tagline: {
    color: "#4DA6FF",
    fontSize: 15,
    letterSpacing: 0.4,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 13,
    backgroundColor: "rgba(77, 166, 255, 0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(77, 166, 255, 0.15)",
  },
  featureText: {
    color: "#4DA6FF",
    fontSize: 12,
    fontWeight: "500",
  },
  featureDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#1A3060",
  },
  buttons: {
    gap: 12,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: "#1A6EEB",
    borderRadius: 16,
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineBtnText: {
    color: "#4DA6FF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  footer: {
    color: "#2A4060",
    fontSize: 11,
    textAlign: "center",
  },
});
