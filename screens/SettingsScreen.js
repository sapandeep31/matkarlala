import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#ccc', true: '#007AFF' }}
          thumbColor={notifications ? '#fff' : '#fff'}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#ccc', true: '#007AFF' }}
          thumbColor={darkMode ? '#fff' : '#fff'}
        />
      </View>

      <Text style={styles.sectionTitle}>About</Text>

      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>App Version</Text>
        <Text style={styles.aboutValue}>1.0.0</Text>
      </View>

      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Developer</Text>
        <Text style={styles.aboutValue}>Your Name</Text>
      </View>

      <Text style={styles.footer}>
        © 2024 मोटापा कम ऐप - Weight Loss Tracker
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  aboutItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aboutLabel: {
    fontSize: 14,
    color: '#666',
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
