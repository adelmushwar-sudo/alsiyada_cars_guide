import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

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
    outputRange: [0, 0.3],
  });

  // تحديد لون النص بناءً على السمة
  const labelTextColor = colors.text === '#000' ? '#000' : '#FFF';
  const labelBackgroundColor = colors.text === '#000' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)';

  return (
    <View style={[styles.container, { bottom: 80 + insets.bottom, right: 16 }]}>
      {expanded && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              backgroundColor: colors.background,
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
          <Pressable
            style={[
              styles.secondaryButton,
              {
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: colors.background,
              },
            ]}
            onPress={() => {
              console.log('إضافة طلب جديد');
              toggleMenu();
            }}
          >
            <MaterialIcons name="note-add" size={24} color="white" />
          </Pressable>
          <View style={[styles.labelContainer, { backgroundColor: labelBackgroundColor }]}>
            <Text style={[styles.label, { color: labelTextColor }]} numberOfLines={1}>
              إضافة طلب
            </Text>
          </View>
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
          <Pressable
            style={[
              styles.secondaryButton,
              {
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: colors.background,
              },
            ]}
            onPress={() => {
              console.log('إضافة سيارة جديدة');
              toggleMenu();
            }}
          >
            <MaterialIcons name="directions-car" size={24} color="white" />
          </Pressable>
          <View style={[styles.labelContainer, { backgroundColor: labelBackgroundColor }]}>
            <Text style={[styles.label, { color: labelTextColor }]} numberOfLines={1}>
              إضافة سيارة
            </Text>
          </View>
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
    flexDirection: 'row-reverse',
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
  },
  labelContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    maxWidth: 80,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
