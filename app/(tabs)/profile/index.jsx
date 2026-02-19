import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { UserContext } from "../../../context/UserContext";
import ComponentInfoBox from "../../../components/ComponentInfoBox";
import { getUserPosts, signOut } from "../../../lib/appwrite";
import Ionicons from "@expo/vector-icons/Ionicons";
import ComponentEmpty from "../../../components/ComponentEmpty";

const likedVideosData = [
  { id: "1", title: "Liked Video 1" },
  { id: "2", title: "Liked Video 2" },
  { id: "3", title: "Liked Video 3" },
  { id: "4", title: "Liked Video 4" },
];

export default (props) => {
  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <Bio />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#4DA6FF",
          tabBarStyle: {
            backgroundColor: "#050D1A",
            borderTopColor: "#1A3060",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#4DA6FF",
            height: 3,
          },
        }}
      >
        <Tab.Screen
          component={LikedVideos}
          name="Liked Videos"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="like" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          component={UserPosts}
          name="User Posts"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="grid-on" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const Tab = createMaterialTopTabNavigator();

const Bio = () => {
  const { user } = React.useContext(UserContext);
  // console.log(user);

  return (
    <View className="w-full items-center px-4 py-6 border-b border-primary-300">
      <View className="w-20 h-20 border-2 border-secondary rounded-full justify-center items-center overflow-hidden mb-3">
        <Image
          source={{ uri: user?.avatar }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <ComponentInfoBox
        containerStyles="mb-1"
        title={user?.username}
        titleStyles="text-xl font-bold"
      />
      <ComponentInfoBox
        placeholder={"Add a bio..."}
        title={user?.bio}
        titleStyles="text-sm text-gray-400"
      />
    </View>
  );
};

const renderItem = ({ item }) => (
  <View className="p-3 mb-2 bg-primary-200 rounded-xl border border-primary-300">
    <Text className="text-white text-base">{item.title}</Text>
  </View>
);

const LikedVideos = () => {
  const { user } = React.useContext(UserContext);
  // const likedPosts = getUserLikedPosts(user.$id);
  return (
    <View className="bg-primary-100 flex-1">
      <FlatList
        data={likedVideosData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="p-2"
        ListEmptyComponent={
          <ComponentEmpty message={"No Liked Posts Found"} />
        }
      />
    </View>
  );
};

const UserPosts = () => {
  const { user } = React.useContext(UserContext);
  const [userPosts, setUserPosts] = React.useState([]);

  const fetchPosts = async () => {
    const posts = await getUserPosts(user.$id);
    setUserPosts(posts);
  };

  React.useEffect(() => {
    if (user?.$id) {
      fetchPosts();
    }
  }, [user]);

  return (
    <View className="bg-primary-100 flex-1">
      <FlatList
        data={userPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        className="p-2"
        ListEmptyComponent={<ComponentEmpty />}
      />
    </View>
  );
};
