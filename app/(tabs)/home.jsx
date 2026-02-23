import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { UserContext } from "../../context/UserContext";
import { useFocusEffect } from "expo-router";
import { useScrollToTop } from "@react-navigation/native";
import { useHomeFeed } from "../../hooks/useHomeFeed";
import HomeHeader from "../../components/HomeHeader";
import PostFeed from "../../components/PostFeed";
import MediaCard from "../../components/MediaCard";
import { SkeletonMediaCard } from "../../components/Skeleton";
import ErrorBoundary, { CardErrorFallback } from "../../components/ErrorBoundary";

export default function Home() {
  const { user } = React.useContext(UserContext);
  const { width } = useWindowDimensions();
  const pagerRef = React.useRef(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [visibleItems, setVisibleItems] = React.useState([]);
  const [isFocused, setIsFocused] = React.useState(true);

  const {
    allPosts, allLoadingMore, allFeedRef,
    followingPosts, followingLoadingMore, followingFeedRef, followingIdsRef,
    loading, refreshing,
    fetchAllNextPage, fetchFollowingNextPage, onRefresh,
  } = useHomeFeed(user?.$id);

  // ── Scroll-to-top: delegate to active FlatList ────────────────────
  const scrollableRef = React.useRef({ scrollToOffset: () => {} });
  useScrollToTop(scrollableRef);
  React.useEffect(() => {
    scrollableRef.current = {
      scrollToOffset: (opts) =>
        (activeTab === 0 ? allFeedRef : followingFeedRef).current?.scrollToOffset(opts),
    };
  }, [activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  // ── Tab navigation ─────────────────────────────────────────────────
  const goToTab = React.useCallback((index) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  }, [width]);

  const onScrollEnd = React.useCallback((e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveTab(index);
  }, [width]);

  // ── Viewability ────────────────────────────────────────────────────
  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    setVisibleItems(viewableItems.map((item) => item.item.$id));
  }, []);
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 90 });

  // ── Render item ────────────────────────────────────────────────────
  const renderPost = ({ item }) => (
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
  );

  return (
    <SafeAreaView className="bg-primary-100 flex-1" edges={["right", "top", "left"]}>
      <HomeHeader activeTab={activeTab} onTabPress={goToTab} />

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
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onScrollEnd}
            style={{ flex: 1 }}
          >
            <View style={{ width }}>
              <PostFeed
                feedRef={allFeedRef}
                data={allPosts}
                renderPost={renderPost}
                onEndReached={fetchAllNextPage}
                loadingMore={allLoadingMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfigRef.current}
                emptyIcon="newspaper-outline"
                emptyText="No posts yet"
              />
            </View>

            <View style={{ width }}>
              <PostFeed
                feedRef={followingFeedRef}
                data={followingPosts}
                renderPost={renderPost}
                onEndReached={fetchFollowingNextPage}
                loadingMore={followingLoadingMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfigRef.current}
                emptyIcon="people-outline"
                emptyText={
                  followingIdsRef.current.length === 0
                    ? "Follow people to see their posts here"
                    : "No posts from people you follow yet"
                }
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
