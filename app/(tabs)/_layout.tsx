import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs 
    screenOptions={{ 
      tabBarActiveTintColor: 'blue',
      tabBarStyle:{
        backgroundColor: "#0d0d0d",
    }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="create-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="message1" size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
           title: '',
           headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
