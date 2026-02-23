import { View, Text, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

export default function PostFeed({
  feedRef,
  data,
  renderPost,
  onEndReached,
  loadingMore,
  refreshing,
  onRefresh,
  onViewableItemsChanged,
  viewabilityConfig,
  emptyIcon,
  emptyText,
}) {
  return (
    <FlatList
      ref={feedRef}
      data={data}
      keyExtractor={(item) => item.$id}
      keyboardShouldPersistTaps="handled"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      renderItem={renderPost}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator color={Colors.secondary.DEFAULT} style={{ paddingVertical: 24 }} />
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
      ListEmptyComponent={
        <View className="items-center pt-20 gap-3">
          <Ionicons name={emptyIcon} size={48} color={Colors.muted.DEFAULT} />
          <Text className="text-muted text-[15px] text-center px-6">{emptyText}</Text>
        </View>
      }
    />
  );
}
