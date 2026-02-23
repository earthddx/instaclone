import React from "react";
import { FlatList } from "react-native";
import ProfileGridItem from "./ProfileGridItem";
import ComponentEmpty from "./ComponentEmpty";
import { SkeletonGrid } from "./Skeleton";

export default function ProfilePostsGrid({ posts, loading, onPressPost, emptyMessage = "No posts yet" }) {
  if (loading) return <SkeletonGrid count={9} />;
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      numColumns={3}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <ProfileGridItem
          item={item}
          index={index}
          onPress={onPressPost}
        />
      )}
      ListEmptyComponent={<ComponentEmpty message={emptyMessage} />}
    />
  );
}
