import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaCard from "../../components/MediaCard";
import { HelloWave } from "../../components/HelloWave";
import { getAllPosts } from "../../lib/appwrite";
import React from "react";

export default function Home() {
  const [posts, setPosts] = React.useState([]);
  const [visibleItems, setVisibleItems] = React.useState([]);
  // console.log(visibleItems);

  const onViewableItemsChanged = ({changed,  viewableItems }) => {
    // Update the list of visible items based on their index
    console.log(viewableItems)
    setVisibleItems(viewableItems.map((item) => item.item.$id));
  };

  const viewConfigRef = {
    viewAreaCoveragePercentThreshold: 90, // How much of the item must be visible in %
  };

  React.useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      <FlatList
        keyExtractor={(item) => item.$id}
        data={posts}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        renderItem={({ item }) => {
          return (
            <MediaCard
              {...item}
              creator={item.creator.username}
              description={item.description}
              source={item.source}
              title={item.title}
              type={item.type}
              isVisible={visibleItems.includes(item.$id)}
            />
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View>
              <View className="border-2 border-secondary-100 rounded-lg p-5">
                <Text className="text-secondary">
                  Stories / trending videos go here || horizontal scroll
                </Text>
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
