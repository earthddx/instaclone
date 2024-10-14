import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";


//TODO: use constants/Colors instead since nativewind does not work here
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e34ba9",
        tabBarStyle: {
          backgroundColor: "#0d0d0d",
          borderTopColor: "#e34ba9",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="magnifier" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="create-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="message1" size={28} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="account"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

//FIXME: example
{
  /* <Tabs
screenOptions={{
tabBarActiveTintColor: Colors.orange.default,
tabBarStyle: {
height: 70,
borderWidth: 1,
borderRadius: 50,
borderColor: Colors.orange.default,
borderTopColor: Colors.orange.default,
backgroundColor: Colors.white.default,
},
tabBarLabelStyle: {
fontSize: 12,
fontWeight: "bold",
marginBottom: 10,
},
}}
>
<Tabs.Screen
name="(HomeNav)"
options={{
title: "Home",
headerShown: false,
tabBarIcon: ({color, size}) => (
<Ionicons name="ios-home" size={size} color={color}/>
),
}}
/>

</Tabs> */
}
