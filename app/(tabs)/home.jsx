import { View, Text, FlatList, RefreshControl, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaCard from "../../components/MediaCard";
import { getAllPosts } from "../../lib/appwrite";
import React from "react";
import { UserContext } from "../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useScrollToTop } from "@react-navigation/native";

export default function Home() {
  const { user } = React.useContext(UserContext);
  const flatListRef = React.useRef(null);
  useScrollToTop(flatListRef);
  const [posts, setPosts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visibleItems, setVisibleItems] = React.useState([]);
  const [isFocused, setIsFocused] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

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
      {/* Header */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        className="px-4 py-3 border-b border-primary-300 flex-row items-center"
      >
        <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
          <Ionicons name="newspaper" size={16} color="#4DA6FF" />
        </View>
        <Text className="text-white text-lg font-bold">Feed</Text>
        <View className="flex-1" />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
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
                creatorAvatar={item.creator?.avatar}
                creatorId={item.creator?.$id}
                description={item.description}
                source={item.source}
                title={item.title}
                type={item.type}
                isVisible={isFocused && visibleItems.includes(item.$id)}
                currentUserId={user?.$id}
                currentUsername={user?.username}
                currentUserAvatar={user?.avatar}
              />
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
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
