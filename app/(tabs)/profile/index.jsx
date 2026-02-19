import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { UserContext } from "../../../context/UserContext";
import { getUserPosts, getUserLikedPosts } from "../../../lib/appwrite";
import ComponentEmpty from "../../../components/ComponentEmpty";

export default (props) => {
  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <Bio />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#4DA6FF",
          tabBarInactiveTintColor: "#3A5070",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#050D1A",
            borderBottomWidth: 1,
            borderBottomColor: "#1A3060",
            elevation: 0,
            shadowOpacity: 0,
            height: 44,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#4DA6FF",
            height: 2,
            bottom: 0,
          },
        }}
      >
        <Tab.Screen
          component={LikedVideos}
          name="Liked Videos"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          component={UserPosts}
          name="User Posts"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
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

  return (
    <View className="px-4 py-3 border-b border-primary-300 flex-row items-center">
      <View className="w-14 h-14 border-2 border-secondary rounded-full overflow-hidden mr-4">
        <Image
          source={{ uri: user?.avatar }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-base">
          {user?.username ?? ""}
        </Text>
        <Text
          className="text-gray-400 text-sm mt-0.5"
          numberOfLines={2}
        >
          {user?.bio ?? "No bio yet"}
        </Text>
      </View>
    </View>
  );
};

const ITEM_SIZE = Dimensions.get("window").width / 3;

const renderGridItem = ({ item }) => {
  const isVideo = item.type?.includes("video");
  const uri = item.source?.replace("/preview", "/view");
  return (
    <TouchableOpacity style={{ width: ITEM_SIZE, height: ITEM_SIZE }}>
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
      {isVideo && (
        <View style={{ position: "absolute", top: 4, right: 4 }}>
          <Ionicons name="play-circle" size={18} color="rgba(255,255,255,0.85)" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const LikedVideos = () => {
  const { user } = React.useContext(UserContext);
  const [likedPosts, setLikedPosts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchLikedPosts = React.useCallback(async () => {
    if (!user?.$id) return;
    setRefreshing(true);
    try {
      const posts = await getUserLikedPosts(user.$id);
      setLikedPosts(posts);
    } finally {
      setRefreshing(false);
    }
  }, [user?.$id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLikedPosts();
    }, [fetchLikedPosts])
  );

  return (
    <View className="bg-primary-100 flex-1">
      <FlatList
        data={likedPosts}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        ListEmptyComponent={<ComponentEmpty message={"No Liked Posts Found"} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchLikedPosts}
            tintColor="#4DA6FF"
            colors={["#4DA6FF"]}
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
    if (user?.$id) {
      fetchPosts();
    }
  }, [user]);

  return (
    <View className="bg-primary-100 flex-1">
      <FlatList
        data={userPosts}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        ListEmptyComponent={<ComponentEmpty />}
      />
    </View>
  );
};
