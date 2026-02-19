import { View, Text, FlatList, RefreshControl, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaCard from "../../components/MediaCard";
import { getAllPosts } from "../../lib/appwrite";
import React from "react";
import { UserContext } from "../../context/UserContext";

export default function Home() {
  const { user } = React.useContext(UserContext);
  const [posts, setPosts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visibleItems, setVisibleItems] = React.useState([]);

  const fetchPosts = async () => {
    const allPosts = await getAllPosts();
    setPosts(allPosts);
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const onViewableItemsChanged = ({ viewableItems }) => {
    // Update the list of visible items based on their index
    // console.log(viewableItems);
    setVisibleItems(viewableItems.map((item) => item.item.$id));
  };
  const viewConfigRef = {
    viewAreaCoveragePercentThreshold: 90, // How much of the item must be visible in %
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <FlatList
        keyExtractor={(item) => item.$id}
        data={posts}
        keyboardShouldPersistTaps="handled"
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
              currentUserId={user?.$id}
              currentUsername={user?.username}
            />
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View className="px-4 pt-4 pb-2">
              <Text className="text-white text-2xl font-bold mb-3">Feed</Text>
              <View className="bg-primary-200 rounded-xl p-4 mb-2">
                <Text className="text-secondary text-sm font-semibold">Stories</Text>
                <Text className="text-gray-500 text-xs mt-1">Coming soon</Text>
              </View>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4DA6FF"
            colors={["#4DA6FF"]}
          />
        }
        // stickyHeaderIndices={[0]}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
