import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import React from "react";
import { UserContext } from "../../context/UserContext";
import ComponentInfoBox from "../../components/ComponentInfoBox";
import { TabView, SceneMap } from "react-native-tab-view";
import MediaCard from "../../components/MediaCard";
import { signOut } from "../../lib/appwrite";

const Account = () => {
  const { user, handleSaveUser } = React.useContext(UserContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [tab, setTab] = React.useState(0);

  const handleTabChange = async (tab) => {
    setTab(tab);
  };
  const onRefresh = () => {};

  const logout = async () => {
    await signOut();
    handleSaveUser(null);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        extraData={tab}
        data={[]}
        keyExtractor={(item) => item.$id}
        // renderItem={({ item }) => (
        //   <MediaCard
        //     {...props}
        //   />
        // )}
        ListEmptyComponent={() => (
          <View className="border-2 p-2 border-red-400 rounded-lg items-center mt-10">
            <Text className="text-white text-lg">No Posts Found</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <>
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
            <TabViewExample onTabChange={handleTabChange} currentTab={tab} />
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Account;

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }}>
    <Text>Bookmarks will go here</Text>
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export const TabViewExample = ({ currentTab, onTabChange }) => {
  console.log(currentTab, onTabChange);
  const layout = useWindowDimensions();

  const [routes] = React.useState([
    { key: "first", title: "Your videos" },
    { key: "second", title: "Liked" },
  ]);

  return (
    <TabView
      navigationState={{ index: currentTab, routes }}
      renderScene={renderScene}
      onIndexChange={onTabChange}
      initialLayout={{ width: layout.width }}
    />
  );
};
