import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SAMPLE_APPS = [
  { id: '1', name: 'Zomato', icon: 'food', emoji: '🍕', color: '#EC1C24' },
  { id: '2', name: 'Swiggy', icon: 'food-fork-drink', emoji: '🍽️', color: '#00A699' },
  { id: '3', name: 'Instagram', icon: 'instagram', emoji: '📸', color: '#E4405F' },
  { id: '4', name: 'YouTube', icon: 'play-circle', emoji: '▶️', color: '#FF0000' },
  { id: '5', name: 'TikTok', icon: 'heart', emoji: '❤️', color: '#000000' },
  { id: '6', name: 'Netflix', icon: 'filmstrip', emoji: '🎬', color: '#E50914' },
];

export default function HomeScreen({ navigation }) {
  const [protectedApps, setProtectedApps] = useState([]);

  useEffect(() => {
    loadProtectedApps();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProtectedApps();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProtectedApps = async () => {
    try {
      const data = await AsyncStorage.getItem('protectedApps');
      if (data) {
        setProtectedApps(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading protected apps:', error);
    }
  };

  const isAppProtected = (appId) => {
    return protectedApps.some(app => app.id === appId);
  };

  const toggleAppProtection = (app) => {
    if (isAppProtected(app.id)) {
      // Remove protection
      const updated = protectedApps.filter(a => a.id !== app.id);
      setProtectedApps(updated);
      AsyncStorage.setItem('protectedApps', JSON.stringify(updated));
    } else {
      // Add protection
      const updated = [...protectedApps, { ...app, warnings: [] }];
      setProtectedApps(updated);
      AsyncStorage.setItem('protectedApps', JSON.stringify(updated));
    }
  };

  const openAppWithWarnings = (app) => {
    if (isAppProtected(app.id)) {
      const appData = protectedApps.find(a => a.id === app.id);
      if (appData && appData.warnings && appData.warnings.length > 0) {
        navigation.navigate('WarningDisplay', { app: appData });
      } else {
        Alert.alert('No Warnings', 'Add warnings for this app to display them.');
      }
    }
  };

  const AppCard = ({ app }) => {
    const protected_ = isAppProtected(app.id);
    return (
      <TouchableOpacity
        style={[styles.appCard, protected_ && styles.appCardProtected]}
        onLongPress={() => toggleAppProtection(app)}
        onPress={() => {
          if (protected_) {
            const appData = protectedApps.find(a => a.id === app.id);
            if (appData && appData.warnings && appData.warnings.length > 0) {
              navigation.navigate('WarningDisplay', { app: appData });
            } else {
              Alert.alert('No Warnings', 'Add warnings for this app to display them.');
            }
          } else {
            Alert.alert(app.name, `Opening ${app.name}...\n\nLong press to protect this app with warnings!`);
          }
        }}
      >
        <View style={[styles.appIconContainer, { backgroundColor: app.color }]}>
          <Text style={styles.emojiIcon}>{app.emoji}</Text>
        </View>
        <Text style={styles.appName}>{app.name}</Text>
        {protected_ && (
          <View style={styles.protectedBadge}>
            <Text style={styles.protectedEmoji}>✓</Text>
            <Text style={styles.protectedText}>Protected</Text>
          </View>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: protected_ ? '#007AFF' : '#ccc' }]}
            onPress={() => toggleAppProtection(app)}
          >
            <Text style={styles.btnEmoji}>{protected_ ? '🛡️' : '⭕'}</Text>
          </TouchableOpacity>
          {protected_ && (
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => navigation.navigate('ConfigureWarnings', { app })}
            >
              <Text style={styles.btnEmoji}>✏️</Text>
            </TouchableOpacity>
          )}
          {protected_ && (
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => openAppWithWarnings(app)}
            >
              <Text style={styles.btnEmoji}>▶️</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>⚠️ Warning Screen Manager</Text>
        <Text style={styles.subtitle}>Long press to protect/unprotect apps</Text>
      </View>
      <FlatList
        data={SAMPLE_APPS}
        renderItem={({ item }) => <AppCard app={item} />}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  appCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appCardProtected: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  appIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  protectedEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  protectedText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 2,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEmoji: {
    fontSize: 16,
  },
});

