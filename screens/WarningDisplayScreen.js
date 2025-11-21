import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  AppState,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function WarningDisplayScreen({ route, navigation }) {
  const { app } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blinkingAnimation] = useState(new Animated.Value(1));
  const [canSwipe, setCanSwipe] = useState(true);

  useEffect(() => {
    // Start blinking animation
    startBlinking();
  }, []);

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkingAnimation, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(blinkingAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const goToNextWarning = () => {
    if (currentIndex < app.warnings.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      openApp();
    }
  };

  const closeApp = () => {
    Alert.alert(
      'Close App',
      'Are you sure you want to close this app?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Yes, Close',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  const openApp = () => {
    Alert.alert(
      'App Opened',
      `Welcome to ${app.name}! You've reviewed all warnings.`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!app.warnings || app.warnings.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No warnings to display</Text>
      </View>
    );
  }

  const currentWarning = app.warnings[currentIndex];
  const progress = ((currentIndex + 1) / app.warnings.length) * 100;

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: blinkingAnimation,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.appIcon, { backgroundColor: app.color }]}>
            <MaterialCommunityIcons name={app.icon} size={50} color="#fff" />
          </View>
          <Text style={styles.appName}>{app.name}</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.warningCount}>
            Warning {currentIndex + 1} of {app.warnings.length}
          </Text>
        </View>

        {/* Warning Text */}
        <View style={styles.warningContainer}>
          <View style={styles.warningIconContainer}>
            <MaterialCommunityIcons name="alert" size={60} color="#FF3B30" />
          </View>
          <Text style={styles.warningTitle}>⚠️ WARNING ⚠️</Text>
          <Text style={styles.warningText}>{currentWarning.text}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.btn, styles.closeBtn]}
            onPress={closeApp}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color="#fff" />
            <Text style={styles.btnText}>Close App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.nextBtn]}
            onPress={goToNextWarning}
          >
            <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#fff" />
            <Text style={styles.btnText}>
              {currentIndex === app.warnings.length - 1 ? 'Open App' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Swipe Hint */}
        <View style={styles.hintContainer}>
          <MaterialCommunityIcons name="gesture-swipe-right" size={20} color="#666" />
          <Text style={styles.hintText}>Swipe right or tap Next</Text>
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  warningCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  warningIconContainer: {
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeBtn: {
    backgroundColor: '#FF3B30',
  },
  nextBtn: {
    backgroundColor: '#34C759',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  hintText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
});
