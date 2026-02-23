import {
  View,
  Text,
  TextInput,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import Colors from "../../constants/colors";
import {
  client,
  config as appwriteConfig,
  getMessages,
  postMessage,
} from "../../lib/appwrite";

const Messages = () => {
  const { user } = React.useContext(UserContext);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState(null);
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const flatListRef = React.useRef(null);
  const cursorRef = React.useRef(null);

  const handleScroll = React.useCallback((event) => {
    setShowScrollBtn(event.nativeEvent.contentOffset.y > 150);
  }, []);

  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { documents, hasMore: more } = await getMessages();
        setMessages(documents);
        setHasMore(more);
        if (documents.length > 0) {
          cursorRef.current = documents[documents.length - 1].$id;
        }
      } catch (error) {
        setFetchError(error.message ?? "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const loadMoreMessages = React.useCallback(async () => {
    if (!hasMore || loadingMore || !cursorRef.current) return;
    setLoadingMore(true);
    try {
      const { documents, hasMore: more } = await getMessages(cursorRef.current);
      setMessages((prev) => [...prev, ...documents]);
      setHasMore(more);
      if (documents.length > 0) {
        cursorRef.current = documents[documents.length - 1].$id;
      }
    } catch {
      // silently ignore — user can keep scrolling to retry
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore]);

  React.useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prev) => [response.payload, ...prev]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prev) =>
            prev.filter((message) => message?.$id !== response.payload?.$id)
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="bg-primary-100 flex-1">
      {/* Header */}
      <View className="px-4 py-3 border-b border-primary-300 flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
          <Ionicons name="chatbubbles" size={16} color={Colors.secondary.DEFAULT} />
        </View>
        <Text className="text-white text-lg font-bold">Messages</Text>
        <View className="flex-1" />
        <View className="w-2 h-2 rounded-full bg-green-400 mr-1.5" />
        <Text className="text-gray-500 text-xs">Live</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.secondary.DEFAULT} />
          </View>
        ) : fetchError ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
            <Text className="text-red-400 text-base font-semibold mt-4 text-center">
              Could not load messages
            </Text>
            <Text className="text-gray-600 text-sm mt-1 text-center">
              {fetchError}
            </Text>
          </View>
        ) : (
        <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingVertical: 12 }}
          onScroll={handleScroll}
          scrollEventThrottle={100}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 12, alignItems: "center" }}>
                <ActivityIndicator size="small" color={Colors.secondary.DEFAULT} />
              </View>
            ) : null
          }
          renderItem={({ item, index }) => {
            const isOwner = user?.$id === item.userId;
            const isNewChainOfMessages =
              index === 0 || messages[index - 1].userId !== item.userId;
            const isLastInChainOfMessages =
              !messages[index + 1] ||
              messages[index + 1].userId !== item.userId;
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showGapTimestamp =
              !isNewChainOfMessages &&
              prevMsg?.userId === item.userId &&
              new Date(prevMsg.$createdAt) - new Date(item.$createdAt) >
                5 * 60 * 1000;
            return (
              <ComponentMessage
                item={item}
                isOwner={isOwner}
                currentUserId={user?.$id}
                timestampAnchor={isNewChainOfMessages || showGapTimestamp}
                usernameAnchor={isLastInChainOfMessages}
              />
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <Ionicons name="chatbubbles-outline" size={52} color={Colors.primary[300]} />
              <Text className="text-primary-300 text-base font-semibold mt-4">
                No messages yet
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                Be the first to say something!
              </Text>
            </View>
          }
          inverted
        />
        {showScrollBtn && (
          <TouchableOpacity
            onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
            activeOpacity={0.8}
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.primary[200],
              borderWidth: 1,
              borderColor: Colors.primary[300],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-down" size={20} color={Colors.secondary.DEFAULT} />
          </TouchableOpacity>
        )}
        </View>
        )}
        <InputArea />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Messages;

const InputArea = () => {
  const [message, setMessage] = React.useState("");
  const { user } = React.useContext(UserContext);
  const hasText = message.trim().length > 0;

  const sendMessage = async () => {
    if (!hasText) return;
    const text = message;
    setMessage("");
    try {
      await postMessage({
        message: text,
        userId: user.$id,
        username: user.username,
        avatar: user.avatar ?? null,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const charsLeft = 250 - message.length;
  const isNearLimit = charsLeft <= 30;

  return (
    <View className="flex-row items-center px-3 py-2 border-t border-primary-300 bg-primary-200 gap-2">
      <View className="flex-1 bg-primary-100 border border-primary-300 rounded-2xl px-4 pt-2 pb-1">
        <TextInput
          className="text-base text-white flex-1 py-0"
          onChangeText={(text) => setMessage(text.slice(0, 250))}
          placeholder="Message..."
          placeholderTextColor={Colors.muted.DEFAULT}
          value={message}
          multiline
          maxLength={250}
          scrollEnabled
        />
        {isNearLimit && (
          <Text
            className="text-xs text-right mt-0.5"
            style={{ color: charsLeft <= 10 ? Colors.error : Colors.muted.DEFAULT }}
          >
            {charsLeft}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={sendMessage}
        activeOpacity={0.7}
        className={`w-11 h-11 rounded-full justify-center items-center ${
          hasText ? "bg-highlight" : "bg-primary-300"
        }`}
      >
        <Ionicons
          name="send"
          size={18}
          color={hasText ? "#fff" : Colors.muted.DEFAULT}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const ComponentMessage = ({
  item,
  isOwner,
  currentUserId,
  timestampAnchor,
  usernameAnchor,
}) => {
  const router = useRouter();
  // With an inverted FlatList:
  //   usernameAnchor = isLastInChain  → topmost bubble of the group visually
  //   timestampAnchor = isNewChain    → bottommost bubble of the group visually
  const isTop = usernameAnchor;
  const isBottom = timestampAnchor;

  const bubbleRadius = isOwner
    ? {
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        borderTopRightRadius: isTop ? 18 : 5,
        borderBottomRightRadius: isBottom ? 18 : 5,
      }
    : {
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        borderTopLeftRadius: isTop ? 18 : 5,
        borderBottomLeftRadius: isBottom ? 18 : 5,
      };

  const date = new Date(item.$createdAt);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const msgDayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const formattedTime =
    msgDayStart.getTime() === todayStart.getTime()
      ? timeStr
      : msgDayStart.getTime() === yesterdayStart.getTime()
      ? `Yesterday ${timeStr}`
      : `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${timeStr}`;

  const handleLongPress = async () => {
    await Clipboard.setStringAsync(item.text);
    Alert.alert("Copied to clipboard");
  };

  const profileRoute =
    item.userId === currentUserId
      ? "/(tabs)/profile"
      : `/user/${item.userId}`;

  return (
    <View
      className={`mx-3 ${isBottom ? "mb-3" : "mb-0.5"}`}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: isOwner ? "flex-end" : "flex-start",
      }}
    >
      {/* Avatar column — non-owner only */}
      {!isOwner && (
        isTop ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(profileRoute)}
            style={{ marginRight: 6, marginTop: 2 }}
          >
            {item.avatar ? (
              <Image
                source={{ uri: item.avatar }}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
            ) : (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: Colors.primary[300],
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Colors.secondary.DEFAULT, fontSize: 12, fontWeight: "bold" }}>
                  {item.username?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )
      )}

      {/* Bubble + username + timestamp */}
      <View style={{ alignItems: isOwner ? "flex-end" : "flex-start" }}>
        {usernameAnchor && !isOwner && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(profileRoute)}
          >
            <Text className="text-gray-500 text-xs mb-1 ml-1">{item.username}</Text>
          </TouchableOpacity>
        )}
        <Pressable onLongPress={handleLongPress}>
          <View
            style={[
              bubbleRadius,
              {
                maxWidth: 280,
                paddingHorizontal: 14,
                paddingVertical: 9,
                backgroundColor: isOwner ? Colors.highlight : Colors.primary[200],
                borderWidth: isOwner ? 0 : 1,
                borderColor: Colors.primary[300],
              },
            ]}
          >
            <Text className="text-white text-base">{item.text}</Text>
          </View>
        </Pressable>
        {timestampAnchor && (
          <Text
            className={`text-xs text-gray-600 mt-1 ${
              isOwner ? "mr-1" : "ml-1"
            }`}
          >
            {formattedTime}
          </Text>
        )}
      </View>
    </View>
  );
};
