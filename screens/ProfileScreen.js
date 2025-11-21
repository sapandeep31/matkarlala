import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>Your Profile</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Current Weight</Text>
        <Text style={styles.infoValue}>-- kg</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Target Weight</Text>
        <Text style={styles.infoValue}>-- kg</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Progress</Text>
        <Text style={styles.infoValue}>0%</Text>
      </View>

      <Text style={styles.note}>Complete your profile to get started!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  note: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
});
