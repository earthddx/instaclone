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
  const data = getMessages();

  const [messages, setMessages] = React.useState(data);

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
            prev.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setMessages(data);
      console.log("Messages is focused.");
      return () => {
        console.log("Messages is now unfocused.");
      };
    }, [JSON.stringify(data)])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.$id}
          renderItem={({ item, index }) => {
            const isOwner = user.$id === item.userId;
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
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    <View className="border-2 border-black-200  flex-row">
      <View className="h-16 flex-1 px-4 bg-black-100  focus:border-secondary items-center flex-row space-x-4">
        <TextInput
          className="text-base mt-0.5 text-white flex-1 font-pregular"
          onChangeText={setMessage}
          placeholder="Type your message"
          value={message}
        />
      </View>
      <ComponentButton
        buttonStyles={"rounded-none w-20 bg-blue-100"}
        onPress={sendMessage}
        title="Send"
      />
    </View>
  );
};

const ComponentMessage = (props) => {
  const { item, isOwner, timestampAnchor, usernameAnchor } = props;
  const bubbleStyle = isOwner
    ? "bg-blue-500 text-white self-end "
    : "bg-gray-300 text-black self-start ";
  const nameStyle = isOwner
    ? "text-right text-blue-700"
    : "text-left text-gray-700";
  const timestampStyle = "text-xs text-gray-500";

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
    <View className="mb-2 mr-2 ml-2">
      {usernameAnchor && (
        <Text className={`text-sm ${nameStyle} mb-1`}>
          {isOwner ? "You" : item.username}
        </Text>
      )}
      <Pressable onLongPress={handleLongPress}>
        <View className={`flex-row max-w-xs ${bubbleStyle} rounded-lg p-3`}>
          <Text className="text-base">{item.text}</Text>
        </View>
      </Pressable>
      {timestampAnchor && (
        <Text
          className={`text-xs ${timestampStyle} mt-1 ${
            isOwner ? "self-end" : "self-start"
          }`}
        >
          {formattedTime}
        </Text>
      )}
    </View>
  );
};
