import {
  View,
  Text,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaCard from "../../components/MediaCard";
import { SkeletonMediaCard } from "../../components/Skeleton";
import ErrorBoundary, { CardErrorFallback } from "../../components/ErrorBoundary";
import { getPostsPage } from "../../lib/appwrite";
import React from "react";
import { UserContext } from "../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useScrollToTop } from "@react-navigation/native";
import Colors from "../../constants/colors";

const PAGE_SIZE = 10;

export default function Home() {
  const { user } = React.useContext(UserContext);
  const flatListRef = React.useRef(null);
  useScrollToTop(flatListRef);

  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const cursorRef = React.useRef(null);

  const [visibleItems, setVisibleItems] = React.useState([]);
  const [isFocused, setIsFocused] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  // ── Fetch first page, reset cursor ────────────────────────────────
  const fetchFirstPage = React.useCallback(async () => {
    cursorRef.current = null;
    const { documents, hasMore: more } = await getPostsPage(PAGE_SIZE, null);
    setPosts(documents);
    setHasMore(more);
    if (documents.length > 0) {
      cursorRef.current = documents[documents.length - 1].$id;
    }
  }, []);

  React.useEffect(() => {
    fetchFirstPage().finally(() => setLoading(false));
  }, []);

  // ── Append next page ───────────────────────────────────────────────
  const fetchNextPage = React.useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const { documents, hasMore: more } = await getPostsPage(
        PAGE_SIZE,
        cursorRef.current
      );
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.$id));
        const fresh = documents.filter((p) => !seen.has(p.$id));
        return [...prev, ...fresh];
      });
      setHasMore(more);
      if (documents.length > 0) {
        cursorRef.current = documents[documents.length - 1].$id;
      }
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore]);

  // ── Pull-to-refresh ────────────────────────────────────────────────
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFirstPage();
    setRefreshing(false);
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    setVisibleItems(viewableItems.map((item) => item.item.$id));
  };
  const viewConfigRef = {
    viewAreaCoveragePercentThreshold: 90,
  };

  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      {/* Header */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        }
        className="px-4 py-3 border-b border-primary-300 flex-row items-center"
      >
        <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
          <Ionicons name="newspaper" size={16} color={Colors.secondary.DEFAULT} />
        </View>
        <Text className="text-white text-lg font-bold">Feed</Text>
        <View className="flex-1" />
      </TouchableOpacity>

      {loading ? (
        <ScrollView>
          <SkeletonMediaCard />
          <SkeletonMediaCard />
          <SkeletonMediaCard />
        </ScrollView>
      ) : (
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
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => (
              <ErrorBoundary key={item.$id} fallback={<CardErrorFallback />}>
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
              </ErrorBoundary>
            )}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  color={Colors.secondary.DEFAULT}
                  style={{ paddingVertical: 24 }}
                />
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.secondary.DEFAULT}
                colors={[Colors.secondary.DEFAULT]}
              />
            }
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
