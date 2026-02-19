import {
  View,
  Text,
  TextInput,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { UserContext } from "../../context/UserContext";
import {
  client,
  config as appwriteConfig,
  getMessages,
  postMessage,
} from "../../lib/appwrite";
import ComponentButton from "../../components/ComponentButton";

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
          console.log("A MESSAGE WAS CREATED");
          setMessages((prev) => [response.payload, ...prev]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setMessages(data);
  //     console.log("Messages is focused.");
  //     return () => {
  //       console.log("Messages is now unfocused.");
  //     };
  //   }, [JSON.stringify(data)])
  // );

  return (
    <SafeAreaView className="bg-primary-100 flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.$id}
          renderItem={({ item, index }) => {
            const isOwner = user?.$id === item.userId;
            //TODO:
            //show old messages separately
            //also, if the time diff is more than ~2min-have it displayed too
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
          inverted
        />
        {/* create ComponentInput based on SearchInput */}
        <InputArea />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Messages;

const InputArea = (props) => {
  const [message, setMessage] = React.useState("");
  const { user } = React.useContext(UserContext);

  const sendMessage = async () => {
    if (message.trim() === "") return;
    setMessage("");
    try {
      await postMessage({
        message,
        userId: user.$id,
        username: user.username,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      //do something
    }
    return;
  };

  return (
    <View className="flex-row border-t border-primary-300 bg-primary-200">
      <View className="h-14 flex-1 px-4 items-center flex-row">
        <TextInput
          className="text-base text-white flex-1"
          onChangeText={setMessage}
          placeholder="Message..."
          placeholderTextColor="#4A6080"
          value={message}
        />
      </View>
      <ComponentButton
        buttonStyles={"rounded-none w-20 min-h-[56px]"}
        onPress={sendMessage}
        title="Send"
      />
    </View>
  );
};

const ComponentMessage = (props) => {
  const { item, isOwner, timestampAnchor, usernameAnchor } = props;
  const bubbleStyle = isOwner
    ? "bg-highlight self-end"
    : "bg-primary-200 self-start border border-primary-300";
  const nameStyle = isOwner
    ? "text-right text-gray-500 text-xs"
    : "text-left text-gray-500 text-xs";

  const dateString = item.$createdAt;
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedTime = `${hours}:${minutes}${ampm}`;

  const handleLongPress = async () => {
    await Clipboard.setStringAsync(item.text);
    Alert.alert("Copied!");
  };

  return (
    <View className="mb-1 mr-3 ml-3">
      {usernameAnchor && (
        <Text className={`${nameStyle} mb-1`}>
          {isOwner ? "You" : item.username}
        </Text>
      )}
      <Pressable onLongPress={handleLongPress}>
        <View className={`max-w-xs ${bubbleStyle} rounded-2xl px-4 py-2`}>
          <Text className="text-white text-base">{item.text}</Text>
        </View>
      </Pressable>
      {timestampAnchor && (
        <Text
          className={`text-xs text-gray-600 mt-1 ${
            isOwner ? "self-end" : "self-start"
          }`}
        >
          {formattedTime}
        </Text>
      )}
    </View>
  );
};
