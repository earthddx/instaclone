import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Settings() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="settings" size={16} color="#4DA6FF" />
        </View>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color="#4DA6FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, styles.lastItem]}>
            <Text style={styles.itemText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  section: {
    backgroundColor: '#132040',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1A3060',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A3060',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontSize: 16,
    color: '#E2E8F0',
  },
});
