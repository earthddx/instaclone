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
} from "react-native";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../../context/UserContext";
import {
  client,
  config as appwriteConfig,
  getMessages,
  postMessage,
} from "../../lib/appwrite";

const Messages = () => {
  const { user } = React.useContext(UserContext);
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    const fetchMessages = async () => {
      const allMessages = await getMessages();
      setMessages(allMessages);
    };
    fetchMessages();
  }, []);

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
          <Ionicons name="chatbubbles" size={16} color="#4DA6FF" />
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
        <FlatList
          data={messages}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item, index }) => {
            const isOwner = user?.$id === item.userId;
            const isNewChainOfMessages =
              index === 0 || messages[index - 1].userId !== item.userId;
            const isLastInChainOfMessages =
              !messages[index + 1] ||
              messages[index + 1].userId !== item.userId;
            return (
              <ComponentMessage
                item={item}
                isOwner={isOwner}
                timestampAnchor={isNewChainOfMessages}
                usernameAnchor={isLastInChainOfMessages}
              />
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <Ionicons name="chatbubbles-outline" size={52} color="#1A3060" />
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
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-row items-center px-3 py-2 border-t border-primary-300 bg-primary-200 gap-2">
      <View className="flex-1 flex-row items-center bg-primary-100 border border-primary-300 rounded-full px-4 min-h-[44px]">
        <TextInput
          className="text-base text-white flex-1 py-2"
          onChangeText={setMessage}
          placeholder="Message..."
          placeholderTextColor="#4A6080"
          value={message}
          multiline
          maxLength={500}
        />
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
          color={hasText ? "#fff" : "#4A6080"}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const ComponentMessage = ({
  item,
  isOwner,
  timestampAnchor,
  usernameAnchor,
}) => {
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
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  const handleLongPress = async () => {
    await Clipboard.setStringAsync(item.text);
    Alert.alert("Copied to clipboard");
  };

  return (
    <View
      className={`mx-3 ${isBottom ? "mb-3" : "mb-0.5"}`}
      style={{ alignItems: isOwner ? "flex-end" : "flex-start" }}
    >
      {usernameAnchor && !isOwner && (
        <Text className="text-gray-500 text-xs mb-1 ml-1">{item.username}</Text>
      )}
      <Pressable onLongPress={handleLongPress}>
        <View
          style={[
            bubbleRadius,
            {
              maxWidth: 280,
              paddingHorizontal: 14,
              paddingVertical: 9,
              backgroundColor: isOwner ? "#1A6EEB" : "#132040",
              borderWidth: isOwner ? 0 : 1,
              borderColor: "#1A3060",
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
  );
};
