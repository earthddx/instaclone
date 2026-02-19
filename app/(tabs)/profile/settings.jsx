import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Edit Profile</Text>
        </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1929',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 10,
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
