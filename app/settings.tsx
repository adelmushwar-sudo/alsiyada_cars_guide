import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { ThemeSelector } from "@/components/theme-selector";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeContext } from "@/lib/theme-provider";

type ThemeMode = "light" | "dark" | "system";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { setColorScheme } = useThemeContext();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل المظهر المحفوظ عند فتح الصفحة
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (
          savedTheme &&
          (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")
        ) {
          setThemeMode(savedTheme as ThemeMode);
          // تطبيق المظهر المحفوظ فوراً
          if (savedTheme === "system") {
            setColorScheme(colorScheme ?? "light");
          } else {
            setColorScheme(savedTheme as "light" | "dark");
          }
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const handleLogout = () => {
    console.log("تسجيل الخروج");
    router.back();
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem("themeMode", mode);
      setThemeMode(mode);

      // تطبيق المظهر فوراً
      if (mode === "dark") {
        setColorScheme("dark");
      } else if (mode === "light") {
        setColorScheme("light");
      } else {
        // system mode
        setColorScheme(colorScheme ?? "light");
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const SettingCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <View
      className="bg-surface rounded-lg border border-border overflow-hidden mb-4"
      style={{
        transitionProperty:
          Platform.OS === "web"
            ? "background-color, border-color"
            : "none",
        transitionDuration: "300ms",
      }}
    >
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-border">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <MaterialIcons
            name={icon as any}
            size={20}
            color={colors.primary}
          />
        </View>
        <Text
          className="text-base font-bold text-foreground"
          style={{ fontFamily: "Cairo" }}
        >
          {title}
        </Text>
      </View>
      <View className="px-4 py-3">{children}</View>
    </View>
  );

  return (
    <View
      className="flex-1 bg-background"
      style={{
        transitionProperty:
          Platform.OS === "web" ? "background-color" : "none",
        transitionDuration: "300ms",
      }}
    >
      {/* App Bar */}
      <View
        className="bg-background border-b border-border px-3 py-2 flex-row items-center justify-between"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          transitionProperty:
            Platform.OS === "web"
              ? "background-color, border-color"
              : "none",
          transitionDuration: "300ms",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text
          className="text-base font-bold text-foreground flex-1 text-center"
          style={{ fontFamily: "Cairo" }}
        >
          الإعدادات
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          {/* User Profile Card */}
          <SettingCard title="بيانات الحساب" icon="person">
            <View className="flex-row items-center gap-3">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <MaterialIcons
                  name="account-circle"
                  size={32}
                  color={colors.primary}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base font-bold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  محمد أحمد
                </Text>
                <Text
                  className="text-xs text-muted mt-1"
                  style={{ fontFamily: "Cairo" }}
                >
                  موظف مبيعات
                </Text>
              </View>
            </View>
          </SettingCard>

          {/* Account Settings */}
          <SettingCard title="إعدادات الحساب" icon="settings">
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="flex-row items-center justify-between py-2 border-b border-border pb-2">
                <Text
                  className="text-sm text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  تغيير كلمة المرور
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color={colors.muted}
                />
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="flex-row items-center justify-between py-2">
                <Text
                  className="text-sm text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  البيانات الشخصية
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color={colors.muted}
                />
              </View>
            </Pressable>
          </SettingCard>

          {/* Theme Settings */}
          <SettingCard title="المظهر والألوان" icon="palette">
            <ThemeSelector onThemeChange={handleThemeChange} />
          </SettingCard>

          {/* Control Center */}
          <Pressable
            onPress={() => router.push("/control-center")}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View
              className="bg-primary rounded-lg p-4 mb-4 flex-row items-center justify-between"
              style={{
                transitionProperty:
                  Platform.OS === "web" ? "background-color" : "none",
                transitionDuration: "300ms",
              }}
            >
              <View className="flex-1">
                <Text
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "Cairo" }}
                >
                  لوحة التحكم
                </Text>
                <Text
                  className="text-xs text-white opacity-80 mt-1"
                  style={{ fontFamily: "Cairo" }}
                >
                  إدارة شاملة للمخزون والمستخدمين
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Archive */}
          <SettingCard title="الأرشيف" icon="archive">
            <Text
              className="text-sm text-muted"
              style={{ fontFamily: "Cairo" }}
            >
              عرض السيارات والطلبات المؤرشفة
            </Text>
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  marginTop: 12,
                },
              ]}
            >
              <View
                className="border border-primary rounded-lg p-3 items-center"
                style={{
                  transitionProperty:
                    Platform.OS === "web"
                      ? "background-color, border-color"
                      : "none",
                  transitionDuration: "300ms",
                }}
              >
                <Text
                  className="text-sm font-semibold text-primary"
                  style={{ fontFamily: "Cairo" }}
                >
                  عرض الأرشيف
                </Text>
              </View>
            </Pressable>
          </SettingCard>

          {/* Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>

      {/* Logout Button */}
      <View
        className="bg-surface border-t border-border px-3 py-3"
        style={{
          paddingBottom: insets.bottom + 8,
          transitionProperty:
            Platform.OS === "web"
              ? "background-color, border-color"
              : "none",
          transitionDuration: "300ms",
        }}
      >
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <View className="bg-error rounded-lg p-3 items-center flex-row gap-2 justify-center">
            <MaterialIcons name="logout" size={20} color="#FFFFFF" />
            <Text
              className="text-sm font-bold text-white"
              style={{ fontFamily: "Cairo" }}
            >
              تسجيل الخروج
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
