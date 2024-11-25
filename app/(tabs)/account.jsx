import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { UserContext } from "../../context/UserContext";
import ComponentInfoBox from "../../components/ComponentInfoBox";
import { TabView, SceneMap } from "react-native-tab-view";
import MediaCard from "../../components/MediaCard";
import { getUserPosts, signOut } from "../../lib/appwrite";
import ComponentEmpty from "../../components/ComponentEmpty";

const likedVideosData = [
  { id: "1", title: "Liked Video 1" },
  { id: "2", title: "Liked Video 2" },
  { id: "3", title: "Liked Video 3" },
];

const userPostsData = [
  { id: "1", title: "User Post 1" },
  { id: "2", title: "User Post 2" },
  { id: "3", title: "User Post 3" },
];

const Tab = createMaterialTopTabNavigator();

const Bio = () => {
  const { user, handleSaveUser } = React.useContext(UserContext);

  const logout = async () => {
    await signOut();
    handleSaveUser(null);
    router.replace("/sign-in");
  };

  return (
    <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
      <TouchableOpacity
        onPress={logout}
        className="flex w-full items-end mb-10"
      >
        <Text className="text-highlight">Logout</Text>
        <Image
          //   source={icons.logout}
          resizeMode="contain"
          className="w-6 h-6"
        />
      </TouchableOpacity>
      <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
        <Image
          source={{ uri: user?.avatar }}
          className="w-[90%] h-[90%] rounded-lg"
          resizeMode="cover"
        />
      </View>
      <ComponentInfoBox
        containerStyles="mt-5"
        subtitle={"@earthddx"} //i think account name and topo should be your real name
        title={user?.username}
        titleStyles="text-lg"
      />
      <View className="mt-5 flex flex-row">
        {/* <InfoBox
        title={posts.length || 0}
        subtitle="Posts"
        titleStyles="text-xl"
        containerStyles="mr-10"
      />
      <InfoBox
        title="1.2k"
        subtitle="Followers"
        titleStyles="text-xl"
      /> */}
        <ComponentInfoBox
          subtitle="Hello World!"
          title="Bio goes here"
          titleStyles="text-xl"
        />
      </View>
    </View>
  );
};

const renderItem = ({ item }) => (
  <View className="p-2 mb-3 bg-slate-200 rounded-xl">
    <Text className="text-lg">{item.title}</Text>
  </View>
);

const LikedVideos = () => {
  const { user } = React.useContext(UserContext);
  // const likedPosts = getUserLikedPosts(user.$id);
  return (
    <FlatList
      data={[]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      className="p-2"
      ListEmptyComponent={<ComponentEmpty classNameText={"text-primary"} message={"No Liked Posts Found"}/>}
    />
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
    fetchPosts();
  }, []);

  return (
    <FlatList
      data={userPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.$id}
      className="p-2"
      ListEmptyComponent={<ComponentEmpty />}
    />
  );
};

export default (props) => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Bio />
      <Tab.Navigator>
        <Tab.Screen
          component={LikedVideos}
          name="Liked Videos"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="like2" size={24} color={"color"} />
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
              <MaterialIcons name="grid-on" size={24} color={"color"} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
