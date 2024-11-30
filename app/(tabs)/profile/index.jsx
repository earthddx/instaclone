import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
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
          tabBarActiveTintColor: "#e34ba9",
          tabBarStyle: {
            backgroundColor: "#0d0d0d",
            borderTopColor: "#e34ba9",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#e34ba9",
            height: 4,
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
              <AntDesign name="like2" size={24} color={color} />
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
  const { user, handleSaveUser } = React.useContext(UserContext);
  console.log(user);

  const logout = async () => {
    await signOut();
    handleSaveUser(null);
    router.replace("/signin");
  };
  const openSettingsMenu = () => {};

  return (
    <SafeAreaView className="w-full flex justify-center items-center px-4">
      <TouchableOpacity
        onPress={openSettingsMenu}
        className="flex w-full items-end mb-10"
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={logout} className="flex w-full items-end">
        <Text className="text-highlight">Logout</Text>
        {/* <Image
          //   source={icons.logout}
          resizeMode="contain"
          className="w-6 h-6"
        /> */}
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
        title={user?.username}
        titleStyles="text-lg"
      />
      <View className="mt-5 flex flex-row">
        <ComponentInfoBox
          placeholder={"Create your bio..."}
          title={user?.bio}
          titleStyles="text-xl"
        />
      </View>
    </SafeAreaView>
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
    <View className="bg-primary-100 flex-1">
      <FlatList
        data={likedVideosData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="p-2"
        ListEmptyComponent={
          <ComponentEmpty
            classNameText={"text-primary"}
            message={"No Liked Posts Found"}
          />
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
    fetchPosts();
  }, []);

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