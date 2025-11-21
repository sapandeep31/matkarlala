import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  DeviceEventEmitter,
  NativeModules,
  Dimensions,
  StyleSheet,
} from 'react-native';
import PagerView from 'react-native-pager-view';

const { width, height } = Dimensions.get('window');

export default function WarningOverlay(props) {
  const [warnings, setWarnings] = useState([]);
  const [targetPkg, setTargetPkg] = useState(props.targetPkg || '');
  const [currentPage, setCurrentPage] = useState(0);
  const blinkingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.warningsJson) {
      try {
        const parsed = JSON.parse(props.warningsJson);
        setWarnings(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setWarnings([]);
      }
    }
    if (props.targetPkg) {
      setTargetPkg(props.targetPkg);
    }

    // Start blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkingAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkingAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Listen for overlay updates
    const sub = DeviceEventEmitter.addListener('OverlayUpdate', (evt) => {
      if (evt.warningsJson) {
        try {
          const parsed = JSON.parse(evt.warningsJson);
          setWarnings(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setWarnings([]);
        }
      }
      if (evt.targetPkg) {
        setTargetPkg(evt.targetPkg);
      }
    });

    return () => sub.remove();
  }, []);

  const handleAllow = () => {
    if (NativeModules.OverlayBridge) {
      NativeModules.OverlayBridge.allow(targetPkg);
    }
  };

  const handleClose = () => {
    if (NativeModules.OverlayBridge) {
      NativeModules.OverlayBridge.close();
    }
  };

  if (warnings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No warnings to display</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>⚠️ WARNING SCREEN ⚠️</Text>
        <Text style={styles.pageIndicator}>
          {currentPage + 1} / {warnings.length}
        </Text>
      </View>

      <Animated.View style={[styles.pagerContainer, { opacity: blinkingAnim }]}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {warnings.map((warning, idx) => (
            <View key={idx} style={styles.warningPage}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </PagerView>
      </Animated.View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentPage + 1) / warnings.length) * 100}%` }]} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={handleClose}>
          <Text style={styles.buttonText}>❌ Close App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.allowButton]} onPress={handleAllow}>
          <Text style={styles.buttonText}>✅ {currentPage === warnings.length - 1 ? 'Open App' : 'Next'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Swipe to see more warnings →</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 2,
    borderBottomColor: '#FF3B30',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  pageIndicator: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  pagerContainer: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  warningPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#1a1a1a',
  },
  warningIcon: {
    fontSize: 80,
    marginBottom: 30,
  },
  warningText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
  },
  allowButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
