import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instaclone</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.description}>
        A React Native social media app built with Expo and Appwrite.
      </Text>
      <Text style={styles.footer}>earthddx · 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C1929',
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
