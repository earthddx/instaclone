import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";

const TECH = [
  { icon: "logo-react",            label: "React Native",  sub: "0.81 · React 19"     },
  { icon: "cube-outline",          label: "Expo",          sub: "SDK 54 · Router v6"  },
  { icon: "server-outline",        label: "Appwrite",      sub: "Backend · Realtime"  },
  { icon: "color-palette-outline", label: "NativeWind",    sub: "Tailwind v4 for RN"  },
  { icon: "layers-outline",        label: "Reanimated",    sub: "Animations v4"       },
  { icon: "triangle-outline",      label: "Skia",          sub: "2D graphics"         },
];

const FEATURES = [
  { icon: "images-outline",        text: "Photo & video posts with captions"          },
  { icon: "heart-outline",         text: "Likes and threaded comments"                },
  { icon: "chatbubbles-outline",   text: "Real-time global chat powered by Appwrite"  },
  { icon: "play-circle-outline",   text: "Reels-style vertical video feed"            },
  { icon: "person-circle-outline", text: "User profiles with post grids"              },
  { icon: "notifications-outline", text: "Live updates via Appwrite subscriptions"    },
  { icon: "search-outline",        text: "Explore feed with photo & video discovery"  },
  { icon: "alarm-outline",         text: "Local push notifications for likes, comments & follows" },
];

/**
 * Shared About screen content.
 * @param {() => void} [onBack]  - If provided, shows a back arrow on the left.
 * @param {() => void} [onMenu]  - If provided, shows the drawer menu icon on the right.
 */
export default function AboutScreen({ onBack, onMenu }) {
  return (
    <SafeAreaView className="flex-1 bg-primary-100" edges={["top"]}>
      {/* Background orbs */}
      <View className="absolute top-[-80px] right-[-70px] w-[240px] h-[240px] rounded-full bg-secondary-100" />
      <View className="absolute bottom-[60px] left-[-90px] w-[210px] h-[210px] rounded-full bg-secondary-50" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-primary-300">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3"
          >
            <Ionicons name="arrow-back" size={16} color={Colors.secondary.DEFAULT} />
          </TouchableOpacity>
        ) : (
          <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
            <Ionicons name="information-circle" size={16} color={Colors.secondary.DEFAULT} />
          </View>
        )}
        <Text className="text-lg font-bold text-white">About</Text>
        {onMenu && (
          <>
            <View className="flex-1" />
            <TouchableOpacity onPress={onMenu} activeOpacity={0.7}>
              <Ionicons name="menu" size={24} color={Colors.secondary.DEFAULT} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}
      >
        {/* Hero */}
        <View className="items-center mt-6 mb-8">
          <View className="w-[76px] h-[76px] rounded-full bg-secondary-200 border-[1.5px] border-secondary-400 items-center justify-center mb-3">
            <Ionicons name="camera" size={34} color={Colors.secondary.DEFAULT} />
          </View>
          <Text className="text-white text-[15px] font-bold tracking-[4px] mb-2">INSTACLONE</Text>
          <View className="bg-secondary-200 border border-secondary-300 rounded-[20px] px-[10px] py-[3px] mb-[14px]">
            <Text className="text-secondary text-xs font-semibold">v1.0.0</Text>
          </View>
          <Text className="text-muted-300 text-sm text-center italic">
            A full-stack social media app, built from scratch.
          </Text>
        </View>

        {/* About card */}
        <View className="bg-surface-card border border-primary-300 rounded-2xl p-4">
          <SectionHeading icon="information-circle-outline" title="What is Instaclone?" />
          <Text className="text-muted-300 text-sm leading-[22px]">
            Instaclone is a personal project that replicates the core experience of a modern
            social media platform — photo & video sharing, a scrollable feed, real-time
            messaging, and interactive profiles.
          </Text>
          <Text className="text-muted-300 text-sm leading-[22px] mt-[10px]">
            The goal was to go beyond tutorial-level apps and build something that feels
            production-quality: real authentication, persistent cloud storage, live data
            subscriptions, and polished UI transitions — all on a single codebase that runs
            on both iOS and Android.
          </Text>
          <Text className="text-muted-300 text-sm leading-[22px] mt-[10px]">
            Every screen was designed and implemented from scratch, with attention to detail
            in layout, animation, and user experience.
          </Text>
        </View>

        {/* Tech stack */}
        <View className="bg-surface-card border border-primary-300 rounded-2xl p-4 mt-[14px]">
          <SectionHeading icon="code-slash-outline" title="Built with" />
          <View className="flex-row flex-wrap gap-2">
            {TECH.map((t) => (
              <View key={t.label} className="w-[47%] bg-secondary-50 border border-primary-300 rounded-[10px] px-3 py-[10px] gap-[3px]">
                <Ionicons name={t.icon} size={20} color={Colors.secondary.DEFAULT} />
                <Text className="text-white text-[13px] font-semibold mt-0.5">{t.label}</Text>
                <Text className="text-muted text-[11px]">{t.sub}</Text>
              </View>
            ))}
          </View>
          <Text className="text-muted-300 text-sm leading-[22px] mt-[10px]">
            The backend is entirely serverless — Appwrite handles auth, database, file
            storage, and real-time event subscriptions. No custom server required.
          </Text>
        </View>

        {/* Features */}
        <View className="bg-surface-card border border-primary-300 rounded-2xl p-4 mt-[14px]">
          <SectionHeading icon="sparkles-outline" title="Features" />
          {FEATURES.map((f) => (
            <View key={f.text} className="flex-row items-start gap-[10px] mb-[10px]">
              <View className="w-7 h-7 rounded-lg bg-secondary-50 border border-primary-300 justify-center items-center mt-px">
                <Ionicons name={f.icon} size={16} color={Colors.secondary.DEFAULT} />
              </View>
              <Text className="text-muted-300 text-sm leading-[22px] flex-1">{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View className="items-center mt-8 gap-1">
          <Text className="text-secondary text-sm font-semibold">Instaclone</Text>
          <Text className="text-muted-200 text-xs">© 2026 · Open source · Made with React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <View className="flex-row items-center gap-[6px] mb-3">
      <Ionicons name={icon} size={15} color={Colors.secondary.DEFAULT} />
      <Text className="text-white text-sm font-bold tracking-[0.4px]">{title}</Text>
    </View>
  );
}
