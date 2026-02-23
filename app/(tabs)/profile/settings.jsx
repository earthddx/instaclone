import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../../constants/colors';

export default function Settings() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-primary-100" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-primary-300">
        <View className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-300 justify-center items-center mr-3">
          <Ionicons name="settings" size={16} color={Colors.secondary.DEFAULT} />
        </View>
        <Text className="text-lg font-bold text-white">Settings</Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color={Colors.secondary.DEFAULT} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-5">
        <View className="bg-primary-200 rounded-xl overflow-hidden border border-primary-300">
          <TouchableOpacity className="p-4 border-b border-primary-300">
            <Text className="text-base text-slate-200">Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 border-b border-primary-300">
            <Text className="text-base text-slate-200">Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4">
            <Text className="text-base text-slate-200">Help & Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
