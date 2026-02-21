import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TECH = [
  { icon: "logo-react",        label: "React Native",   sub: "0.81 · React 19"        },
  { icon: "cube-outline",      label: "Expo",           sub: "SDK 54 · Router v6"     },
  { icon: "server-outline",    label: "Appwrite",       sub: "Backend · Realtime"     },
  { icon: "color-palette-outline", label: "NativeWind", sub: "Tailwind v4 for RN"    },
  { icon: "layers-outline",    label: "Reanimated",     sub: "Animations v4"          },
  { icon: "triangle-outline",  label: "Skia",           sub: "2D graphics"            },
];

const FEATURES = [
  { icon: "images-outline",       text: "Photo & video posts with captions"             },
  { icon: "heart-outline",        text: "Likes and threaded comments"                   },
  { icon: "chatbubbles-outline",  text: "Real-time global chat powered by Appwrite"     },
  { icon: "play-circle-outline",  text: "Reels-style vertical video feed"               },
  { icon: "person-circle-outline",text: "User profiles with post grids"                 },
  { icon: "notifications-outline",text: "Live updates via Appwrite subscriptions"       },
  { icon: "search-outline",       text: "Explore feed with photo & video discovery"     },
];

export default function About() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Background orbs */}
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="information-circle" size={16} color="#4DA6FF" />
        </View>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color="#4DA6FF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}
      >
        {/* Hero */}
        <View className="items-center mt-6 mb-8">
          <View style={styles.logoRing}>
            <Ionicons name="camera" size={34} color="#4DA6FF" />
          </View>
          <Text style={styles.appName}>INSTACLONE</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
          <Text style={styles.tagline}>
            A full-stack social media app, built from scratch.
          </Text>
        </View>

        {/* About card */}
        <View style={styles.card}>
          <SectionHeading icon="information-circle-outline" title="What is Instaclone?" />
          <Text style={styles.body}>
            Instaclone is a personal project that replicates the core experience of a modern
            social media platform — photo & video sharing, a scrollable feed, real-time
            messaging, and interactive profiles.
          </Text>
          <Text style={[styles.body, { marginTop: 10 }]}>
            The goal was to go beyond tutorial-level apps and build something that feels
            production-quality: real authentication, persistent cloud storage, live data
            subscriptions, and polished UI transitions — all on a single codebase that runs
            on both iOS and Android.
          </Text>
          <Text style={[styles.body, { marginTop: 10 }]}>
            Every screen was designed and implemented from scratch, with attention to detail
            in layout, animation, and user experience.
          </Text>
        </View>

        {/* Tech stack */}
        <View style={[styles.card, { marginTop: 14 }]}>
          <SectionHeading icon="code-slash-outline" title="Built with" />
          <View style={styles.techGrid}>
            {TECH.map((t) => (
              <View key={t.label} style={styles.techChip}>
                <Ionicons name={t.icon} size={20} color="#4DA6FF" />
                <Text style={styles.techLabel}>{t.label}</Text>
                <Text style={styles.techSub}>{t.sub}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.body, { marginTop: 12 }]}>
            The backend is entirely serverless — Appwrite handles auth, database, file
            storage, and real-time event subscriptions. No custom server required.
          </Text>
        </View>

        {/* Features */}
        <View style={[styles.card, { marginTop: 14 }]}>
          <SectionHeading icon="sparkles-outline" title="Features" />
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={16} color="#4DA6FF" />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View className="items-center mt-8 gap-1">
          <Text style={styles.footerName}>earthddx</Text>
          <Text style={styles.footerYear}>© 2026 · Open source · Made with React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <View style={styles.sectionHeadingRow}>
      <Ionicons name={icon} size={15} color="#4DA6FF" />
      <Text style={styles.sectionHeadingText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  orbTopRight: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(77, 166, 255, 0.07)",
  },
  orbBottomLeft: {
    position: "absolute",
    bottom: 60,
    left: -90,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(26, 110, 235, 0.06)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A3060",
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(77,166,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(77,166,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(77, 166, 255, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(77, 166, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 4,
    marginBottom: 8,
  },
  versionBadge: {
    backgroundColor: "rgba(77,166,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(77,166,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 14,
  },
  versionText: {
    color: "#4DA6FF",
    fontSize: 12,
    fontWeight: "600",
  },
  tagline: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "rgba(26, 48, 96, 0.18)",
    borderWidth: 1,
    borderColor: "#1A3060",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionHeadingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  body: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  techChip: {
    width: "47%",
    backgroundColor: "rgba(77,166,255,0.06)",
    borderWidth: 1,
    borderColor: "#1A3060",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  techLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  techSub: {
    color: "#4A6080",
    fontSize: 11,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(77,166,255,0.08)",
    borderWidth: 1,
    borderColor: "#1A3060",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  featureText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  footerName: {
    color: "#4DA6FF",
    fontSize: 14,
    fontWeight: "600",
  },
  footerYear: {
    color: "#3A5070",
    fontSize: 12,
  },
});
