import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigureWarningsScreen({ route, navigation }) {
  const { app } = route.params;
  const [warnings, setWarnings] = useState([]);
  const [newWarning, setNewWarning] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWarnings();
  }, []);

  const loadWarnings = async () => {
    try {
      const data = await AsyncStorage.getItem('protectedApps');
      if (data) {
        const apps = JSON.parse(data);
        const currentApp = apps.find(a => a.id === app.id);
        if (currentApp && currentApp.warnings) {
          setWarnings(currentApp.warnings);
        }
      }
    } catch (error) {
      console.error('Error loading warnings:', error);
    }
  };

  const saveWarnings = async (updatedWarnings) => {
    try {
      const data = await AsyncStorage.getItem('protectedApps');
      if (data) {
        let apps = JSON.parse(data);
        apps = apps.map(a =>
          a.id === app.id ? { ...a, warnings: updatedWarnings } : a
        );
        await AsyncStorage.setItem('protectedApps', JSON.stringify(apps));
      }
    } catch (error) {
      console.error('Error saving warnings:', error);
    }
  };

  const addWarning = () => {
    if (newWarning.trim() === '') {
      Alert.alert('Empty Warning', 'Please enter warning text');
      return;
    }

    const updatedWarnings = [
      ...warnings,
      {
        id: Date.now().toString(),
        text: newWarning,
      },
    ];
    setWarnings(updatedWarnings);
    saveWarnings(updatedWarnings);
    setNewWarning('');
  };

  const deleteWarning = (id) => {
    const updatedWarnings = warnings.filter(w => w.id !== id);
    setWarnings(updatedWarnings);
    saveWarnings(updatedWarnings);
  };

  const WarningItem = ({ warning, index }) => (
    <View style={styles.warningItem}>
      <View style={styles.warningNumber}>
        <Text style={styles.warningNumberText}>{index + 1}</Text>
      </View>
      <Text style={styles.warningText}>{warning.text}</Text>
      <TouchableOpacity
        onPress={() => deleteWarning(warning.id)}
        style={styles.deleteBtn}
      >
        <MaterialCommunityIcons name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Header */}
        <View style={[styles.appHeader, { backgroundColor: app.color }]}>
          <MaterialCommunityIcons name={app.icon} size={50} color="#fff" />
          <Text style={styles.appTitle}>{app.name}</Text>
          <Text style={styles.appSubtitle}>Configure Warning Screens</Text>
        </View>

        {/* Add Warning Section */}
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Warning</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter warning text (e.g., 'This app causes weight gain')"
              placeholderTextColor="#999"
              value={newWarning}
              onChangeText={setNewWarning}
              multiline
              maxLength={200}
            />
            <Text style={styles.charCount}>{newWarning.length}/200</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={addWarning}
          >
            <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add Warning</Text>
          </TouchableOpacity>
        </View>

        {/* Warnings List */}
        <View style={styles.warningsSection}>
          <Text style={styles.sectionTitle}>
            Warnings ({warnings.length})
          </Text>
          {warnings.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No warnings added yet</Text>
              <Text style={styles.emptySubtext}>
                Add warnings that will appear when opening this app
              </Text>
            </View>
          ) : (
            <FlatList
              data={warnings}
              renderItem={({ item, index }) => <WarningItem warning={item} index={index} />}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Preview Info */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Users will swipe through these warnings. Add motivational or informational text!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  appHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  addSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  warningsSection: {
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center',
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 10,
  },
  warningNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  deleteBtn: {
    paddingHorizontal: 8,
  },
  infoBox: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#0066CC',
    marginLeft: 10,
    lineHeight: 16,
  },
});
