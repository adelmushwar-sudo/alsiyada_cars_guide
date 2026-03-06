import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Text,
  Platform,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FloatingActionButton() {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const carButtonTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const requestButtonTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -130],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const overlayOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, { bottom: 80 + insets.bottom }]}>
      {expanded && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />
        </Animated.View>
      )}

      <View style={styles.buttonContainer}>
        {/* خيار إضافة طلب جديد */}
        <Animated.View
          style={[
            styles.secondaryButtonContainer,
            {
              transform: [{ translateY: requestButtonTranslate }],
              opacity,
            },
          ]}
        >
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: colors.text }]}>إضافة طلب جديد</Text>
          </View>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: colors.background }]}
            onPress={() => {
              console.log('إضافة طلب جديد');
              toggleMenu();
            }}
          >
            <MaterialIcons name="note-add" size={24} color={colors.primary} />
          </Pressable>
        </Animated.View>

        {/* خيار إضافة سيارة جديدة */}
        <Animated.View
          style={[
            styles.secondaryButtonContainer,
            {
              transform: [{ translateY: carButtonTranslate }],
              opacity,
            },
          ]}
        >
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: colors.text }]}>إضافة سيارة جديدة</Text>
          </View>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: colors.background }]}
            onPress={() => {
              console.log('إضافة سيارة جديدة');
              toggleMenu();
            }}
          >
            <MaterialIcons name="directions-car" size={24} color={colors.primary} />
          </Pressable>
        </Animated.View>

        {/* الزر الأساسي */}
        <Pressable
          onPress={toggleMenu}
          style={({ pressed }) => [
            {
              transform: [{ scale: pressed ? 0.9 : 1 }],
            },
          ]}
        >
          <View
            style={[
              styles.mainButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
          >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <MaterialIcons name="add" size={32} color="white" />
            </Animated.View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: -1,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  secondaryButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: 0,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginLeft: 10,
  },
  labelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
