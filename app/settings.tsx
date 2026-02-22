import { ScrollView, Text, View, Pressable, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeMode = "light" | "dark" | "system";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل المظهر المحفوظ عند فتح الصفحة
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
          setThemeMode(savedTheme as ThemeMode);
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
    // TODO: تنفيذ تسجيل الخروج
    console.log("تسجيل الخروج");
    router.back();
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem("themeMode", mode);
      setThemeMode(mode);

      // تطبيق المظهر على النظام
      if (mode === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (mode === "light") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        // system mode
        if (colorScheme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const renderThemeOption = (mode: ThemeMode, label: string, icon: string) => (
    <Pressable
      onPress={() => handleThemeChange(mode)}
      style={({ pressed }) => [{ 
        opacity: pressed ? 0.8 : 1,
        transitionProperty: Platform.OS === "web" ? "opacity" : "none",
        transitionDuration: "150ms",
      }]}
    >
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b border-border"
        style={{
          backgroundColor:
            themeMode === mode ? colors.primary + "10" : "transparent",
          transitionProperty: Platform.OS === "web" ? "background-color" : "none",
          transitionDuration: "300ms",
        }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <MaterialIcons name={icon as any} size={24} color={colors.primary} />
          <Text
            className="text-base font-semibold text-foreground"
            style={{ fontFamily: "Cairo" }}
          >
            {label}
          </Text>
        </View>
        {themeMode === mode && (
          <MaterialIcons name="check-circle" size={24} color={colors.primary} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background" style={{
      transitionProperty: Platform.OS === "web" ? "background-color" : "none",
      transitionDuration: "300ms",
    }}>
      {/* رأس الصفحة مع زر الرجوع */}
      <View className="bg-background border-b border-border px-4 py-4 flex-row items-center gap-3" style={{
        transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
        transitionDuration: "300ms",
      }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={28} color={colors.primary} />
        </Pressable>
        <Text
          className="text-2xl font-bold text-foreground flex-1"
          style={{ fontFamily: "Cairo" }}
        >
          الإعدادات
        </Text>
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {/* بطاقة بيانات المستخدم */}
          <View className="px-4 py-6">
            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
              <View className="bg-surface rounded-lg p-4 flex-row items-center gap-4 border border-border" style={{
                transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
                transitionDuration: "300ms",
              }}>
                {/* صورة المستخدم */}
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{ 
                    backgroundColor: colors.primary,
                    transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                    transitionDuration: "300ms",
                  }}
                >
                  <MaterialIcons name="person" size={32} color="#FFFFFF" />
                </View>

                {/* بيانات المستخدم */}
                <View className="flex-1">
                  <Text
                    className="text-lg font-bold text-foreground"
                    style={{ fontFamily: "Cairo" }}
                  >
                    أحمد محمد
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    موظف مبيعات
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    ahmed.mohammad@alsiyada.com
                  </Text>
                </View>

                {/* أيقونة التعديل */}
                <MaterialIcons name="edit" size={24} color={colors.primary} />
              </View>
            </Pressable>
          </View>

          {/* بطاقة إعدادات الحساب */}
          <View className="px-4 py-4">
            <Text
              className="text-lg font-bold text-foreground mb-3"
              style={{ fontFamily: "Cairo" }}
            >
              إعدادات الحساب
            </Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden" style={{
              transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
              transitionDuration: "300ms",
            }}>
              <Pressable
                style={({ pressed }) => [{ 
                  opacity: pressed ? 0.8 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ 
                        backgroundColor: colors.primary + "20",
                        transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                        transitionDuration: "300ms",
                      }}
                    >
                      <MaterialIcons
                        name="lock"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        تغيير كلمة المرور
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        تحديث كلمة المرور الخاصة بك
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [{ 
                  opacity: pressed ? 0.8 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ 
                        backgroundColor: colors.primary + "20",
                        transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                        transitionDuration: "300ms",
                      }}
                    >
                      <MaterialIcons
                        name="notifications"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        الإشعارات
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        إدارة إعدادات الإشعارات
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* بطاقة التحكم بالمظهر */}
          <View className="px-4 py-4">
            <Text
              className="text-lg font-bold text-foreground mb-3"
              style={{ fontFamily: "Cairo" }}
            >
              المظهر
            </Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden" style={{
              transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
              transitionDuration: "300ms",
            }}>
              {renderThemeOption("light", "وضع النهار", "light-mode")}
              {renderThemeOption("dark", "وضع الليل", "dark-mode")}
              {renderThemeOption("system", "اتباع النظام", "settings")}
            </View>
          </View>

          {/* بطاقة الأرشيف */}
          <View className="px-4 py-4">
            <Text
              className="text-lg font-bold text-foreground mb-3"
              style={{ fontFamily: "Cairo" }}
            >
              البيانات والخصوصية
            </Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden" style={{
              transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
              transitionDuration: "300ms",
            }}>
              <Pressable
                style={({ pressed }) => [{ 
                  opacity: pressed ? 0.8 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ 
                        backgroundColor: colors.warning + "20",
                        transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                        transitionDuration: "300ms",
                      }}
                    >
                      <MaterialIcons
                        name="archive"
                        size={20}
                        color={colors.warning}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        الأرشيف
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        عرض البيانات المؤرشفة
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [{ 
                  opacity: pressed ? 0.8 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ 
                        backgroundColor: colors.primary + "20",
                        transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                        transitionDuration: "300ms",
                      }}
                    >
                      <MaterialIcons
                        name="privacy-tip"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        سياسة الخصوصية
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        اقرأ سياسة الخصوصية الخاصة بنا
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* معلومات التطبيق */}
          <View className="px-4 py-4">
            <View className="bg-surface rounded-lg border border-border p-4" style={{
              transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
              transitionDuration: "300ms",
            }}>
              <Text
                className="text-sm text-muted text-center"
                style={{ fontFamily: "Cairo" }}
              >
                دليل السيارات
              </Text>
              <Text className="text-xs text-muted text-center mt-2">
                الإصدار 1.0.0
              </Text>
            </View>
          </View>

          {/* زر تسجيل الخروج */}
          <View className="px-4 py-6 pb-8">
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [{ 
                opacity: pressed ? 0.8 : 1,
                transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                transitionDuration: "150ms",
              }]}
            >
              <View className="bg-error rounded-lg p-4 items-center" style={{
                transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                transitionDuration: "300ms",
              }}>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="logout" size={24} color="#FFFFFF" />
                  <Text
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "Cairo" }}
                  >
                    تسجيل الخروج
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
