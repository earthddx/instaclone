import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaCard from "../../components/MediaCard";
import { HelloWave } from "../../components/HelloWave";

const testData = [
  {
    id: Math.random(),
    title: "Shane Gillis as Donald Trump",
    link: "https://www.youtube.com/shorts/CkKUysrLnTk",
    creator: "Artem",
    likesCount: "100",
  },
  {
    id: Math.random(),
    title: "Adam Ray as Joe Biden",
    link: "https://www.youtube.com/shorts/CkKUysrLnTk",
    creator: "Enzomenzo",
    likesCount: "100",
  },
  {
    id: Math.random(),
    title: "Kill Tony",
    link: "https://www.youtube.com/shorts/CkKUysrLnTk",
    creator: "Earthddx",
    likesCount: "100",
  },
];

export default function Home() {
  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      <FlatList
        data={testData}
        renderItem={({ item }) => {
          return <MediaCard {...item} type="video" />;
        }}
        ListHeaderComponent={() => {
          return (
            <View>
              <View className="border-2 border-secondary-100 rounded-lg p-5">
                <Text className="text-secondary">Stories / trending videos go here || horizontal scroll</Text>
              </View>
              <HelloWave />
            </View>
          );
        }}
        // stickyHeaderIndices={[0]}
      />
    </SafeAreaView>
  );
}
