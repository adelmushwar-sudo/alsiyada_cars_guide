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
import Svg, { Path, Defs, Filter, FeGaussianBlur } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH / 3;
const BAR_HEIGHT = 75;
const CURVE_DEPTH = 40;
const CURVE_WIDTH = TAB_WIDTH + 20;

interface ConcaveBottomBarProps extends BottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function ConcaveBottomBar({
  state,
  descriptors,
  navigation,
}: ConcaveBottomBarProps) {
  const colors = useColors();
  const curvePosition = useRef(new Animated.Value(0)).current;
  const scaleAnimations = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;
  const bounceAnimations = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;
  const opacityAnimations = useRef(
    state.routes.map(() => new Animated.Value(0.6))
  ).current;

  // تحديث موضع المنحنى عند تغيير التبويب النشط
  useEffect(() => {
    const activeIndex = state.index;

    // حركة سلسة وسريعة للمنحنى
    Animated.timing(curvePosition, {
      toValue: activeIndex * TAB_WIDTH - 10,
      duration: 350,
      useNativeDriver: false,
    }).start();

    // تطبيق تأثير القفزة (Bounce) على الأيقونة النشطة
    Animated.sequence([
      Animated.timing(bounceAnimations[activeIndex], {
        toValue: -12,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.spring(bounceAnimations[activeIndex], {
        toValue: 0,
        tension: 60,
        friction: 6,
        useNativeDriver: false,
      }),
    ]).start();

    // تطبيق تأثير التكبير على الأيقونة النشطة
    Animated.timing(scaleAnimations[activeIndex], {
      toValue: 1.25,
      duration: 250,
      useNativeDriver: false,
    }).start();

    // تطبيق تأثير الشفافية على الأيقونة النشطة
    Animated.timing(opacityAnimations[activeIndex], {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();

    // إعادة تعيين الأيقونات غير النشطة
    state.routes.forEach((_, index: number) => {
      if (index !== activeIndex) {
        Animated.timing(scaleAnimations[index], {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }).start();

        Animated.timing(opacityAnimations[index], {
          toValue: 0.6,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [state.index]);

  const handlePress = (index: number) => {
    const route = state.routes[index];
    const isFocused = state.index === index;

    if (!isFocused) {
      // تطبيق رد فعل لمسي عند التنقل
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      navigation.navigate(route.name);
    }
  };

  // رسم المنحنى الغائر باستخدام SVG مع Bezier Curves محسنة
  const CurveShape = ({ position }: { position: any }) => {
    const generateCurvePath = (x: number) => {
      const startX = x - 10;
      const endX = x + TAB_WIDTH + 10;
      const midX = (startX + endX) / 2;
      const topY = 0;
      const bottomY = CURVE_DEPTH;

      // منحنى غائر (Concave) محسن باستخدام Bezier Curves
      // يتم استخدام نقاط تحكم متعددة لإنشاء منحنى انسيابي جداً
      return `
        M ${startX} ${topY}
        C ${startX + 8} ${topY}, ${midX - TAB_WIDTH * 0.25} ${bottomY - 5}, ${midX - TAB_WIDTH * 0.15} ${bottomY + 3}
        C ${midX - 5} ${bottomY + 5}, ${midX + 5} ${bottomY + 5}, ${midX + TAB_WIDTH * 0.15} ${bottomY + 3}
        C ${midX + TAB_WIDTH * 0.25} ${bottomY - 5}, ${endX - 8} ${topY}, ${endX} ${topY}
      `;
    };

    return (
      <Animated.View
        style={[
          styles.curveContainer,
          {
            transform: [{ translateX: position }],
          },
        ]}
      >
        <Svg
          width={CURVE_WIDTH}
          height={CURVE_DEPTH + 15}
          viewBox={`0 0 ${CURVE_WIDTH} ${CURVE_DEPTH + 15}`}
        >
          <Defs>
            <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </Filter>
          </Defs>
          <Path
            d={generateCurvePath(10)}
            fill={colors.primary}
            stroke="none"
            filter="url(#shadow)"
          />
        </Svg>
      </Animated.View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {/* خط أفقي أعلى الشريط */}
      <View
        style={[
          styles.topLine,
          {
            backgroundColor: colors.primary,
          },
        ]}
      />

      {/* المنحنى الغائر */}
      <CurveShape position={curvePosition} />

      {/* خلفية شريط التنقل */}
      <View
        style={[
          styles.barBackground,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      />

      {/* التبويبات */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const iconColor = isFocused ? "#FFFFFF" : colors.muted;
          const labelColor = isFocused ? colors.primary : colors.muted;

          // اختيار الأيقونة بناءً على اسم المسار
          const getIcon = () => {
            switch (route.name) {
              case "our-inventory":
                return (
                  <MaterialIcons
                    name="inventory-2"
                    size={24}
                    color={iconColor}
                  />
                );
              case "index":
                return (
                  <IconSymbol
                    size={26}
                    name="house.fill"
                    color={iconColor}
                  />
                );
              case "requests":
                return (
                  <MaterialIcons
                    name="list-alt"
                    size={24}
                    color={iconColor}
                  />
                );
              default:
                return null;
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={() => handlePress(index)}
              style={[
                styles.tab,
                {
                  width: TAB_WIDTH,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [
                      { scale: scaleAnimations[index] },
                      { translateY: bounceAnimations[index] },
                    ],
                    opacity: opacityAnimations[index],
                  },
                ]}
              >
                {isFocused && (
                  <View
                    style={[
                      styles.iconBackground,
                      {
                        backgroundColor: colors.primary,
                        shadowColor: colors.primary,
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 8,
                      },
                    ]}
                  />
                )}
                {getIcon()}
              </Animated.View>

              {!isFocused && (
                <Animated.Text
                  style={[
                    styles.label,
                    {
                      color: labelColor,
                      opacity: opacityAnimations[index],
                    },
                  ]}
                >
                  {options.title || route.name}
                </Animated.Text>
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
    position: "relative",
    paddingBottom: Platform.OS === "web" ? 8 : 0,
    borderTopWidth: 0,
  },
  topLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 20,
  },
  barBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
  },
  curveContainer: {
    position: "absolute",
    top: -CURVE_DEPTH,
    width: CURVE_WIDTH,
    height: CURVE_DEPTH + 15,
    zIndex: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: BAR_HEIGHT,
    zIndex: 5,
    paddingTop: 12,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconBackground: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    zIndex: -1,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Cairo",
    marginTop: 4,
  },
});
      
