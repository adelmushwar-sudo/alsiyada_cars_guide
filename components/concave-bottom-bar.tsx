import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Pressable,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = SCREEN_WIDTH / 3;
const BAR_HEIGHT = 65;
const CIRCLE_SIZE = 60; // حجم الدائرة البارزة

export function ConcaveBottomBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colors = useColors();
  const animatedValue = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();
  }, [state.index]);

  // رسم المسار الانسيابي للشريط مع التجويف الدائري
  const centerX = TAB_WIDTH / 2;
  const d = `
    M 0 0
    L ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX - 45, TAB_WIDTH + centerX - 45, 2 * TAB_WIDTH + centerX - 45]
    })} 0
    C ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX - 35, TAB_WIDTH + centerX - 35, 2 * TAB_WIDTH + centerX - 35]
    })} 0, ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX - 30, TAB_WIDTH + centerX - 30, 2 * TAB_WIDTH + centerX - 30]
    })} 35, ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX, TAB_WIDTH + centerX, 2 * TAB_WIDTH + centerX]
    })} 35
    C ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX + 30, TAB_WIDTH + centerX + 30, 2 * TAB_WIDTH + centerX + 30]
    })} 35, ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX + 35, TAB_WIDTH + centerX + 35, 2 * TAB_WIDTH + centerX + 35]
    })} 0, ${animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [centerX + 45, TAB_WIDTH + centerX + 45, 2 * TAB_WIDTH + centerX + 45]
    })} 0
    L ${SCREEN_WIDTH} 0
    L ${SCREEN_WIDTH} ${BAR_HEIGHT}
    L 0 ${BAR_HEIGHT}
    Z
  `;

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  return (
    <View style={styles.container}>
      <Svg width={SCREEN_WIDTH} height={BAR_HEIGHT} style={styles.svg}>
        <AnimatedPath d={d} fill={colors.background} />
      </Svg>

      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          
          const handlePress = () => {
            if (!isFocused) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          const getIcon = (focused: boolean) => {
            const color = focused ? "#FFFFFF" : colors.muted;
            switch (route.name) {
              case "index": return <IconSymbol size={28} name="house.fill" color={color} />;
              case "our-inventory": return <MaterialIcons name="inventory-2" size={26} color={color} />;
              case "requests": return <MaterialIcons name="list-alt" size={26} color={color} />;
              default: return null;
            }
          };

          const getLabel = () => {
            switch (route.name) {
              case "index": return "الرئيسية";
              case "our-inventory": return "لدينا";
              case "requests": return "مطلوب";
              default: return "";
            }
          };

          return (
            <Pressable key={route.key} onPress={handlePress} style={styles.tab}>
              {isFocused ? (
                <Animated.View style={[
                  styles.activeIconContainer,
                  {
                    backgroundColor: colors.primary,
                    transform: [{ translateY: -28 }]
                  }
                ]}>
                  {getIcon(true)}
                </Animated.View>
              ) : (
                <View style={styles.inactiveContainer}>
                  {getIcon(false)}
                  <Animated.Text style={[styles.label, { color: colors.muted }]}>
                    {getLabel()}
                  </Animated.Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: "transparent",
  },
  svg: {
    position: "absolute",
    top: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    height: BAR_HEIGHT,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 4,
    borderColor: "#121212", // عدل هذا ليتناسب مع خلفية التطبيق الداكنة
  },
  inactiveContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: "Cairo",
    marginTop: 4,
  },
});
