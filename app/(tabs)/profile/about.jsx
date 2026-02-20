import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function About() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="information-circle" size={16} color="#4DA6FF" />
        </View>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color="#4DA6FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Instaclone</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          A React Native social media app built with Expo and Appwrite.
        </Text>
        <Text style={styles.footer}>earthddx · 2026</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C1929',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A3060',
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(77,166,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77,166,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#4DA6FF',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  footer: {
    fontSize: 13,
    color: '#3A5070',
  },
});
